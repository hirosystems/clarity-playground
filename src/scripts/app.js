import { Cl } from "@stacks/transactions";

let contractDeployed = 0;

let deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
let wallet_1 = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5";
let wallet_2 = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG";
let wallet_3 = "ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC";

let storedHistory = localStorage.getItem("console-history");
let parsdedHistory = storedHistory ? JSON.parse(storedHistory) : null;
/** @type string[] */
let history = parsdedHistory || ["(contract-call? .contract-0 get-count)"];
let currentHistoryIndex = history.length;
let isBrowsingHistory = false;

let deployed = false;

/** @type {import("@hirosystems/clarinet-sdk-browser").Simnet | null} */
let simnet = null;

/**
 * @param {string} initialContract
 */
async function initClarinetSDK(initialContract) {
  const { initSimnet, SDK } = await import("@hirosystems/clarinet-sdk-browser");

  // init simnet
  simnet = await initSimnet();
  await simnet.initEmtpySession();

  [deployer, wallet_1, wallet_2, wallet_3].forEach((address) => {
    // @ts-ignore
    simnet.mintSTX(address, 1000000000n);
  });

  simnet.executeCommand(`::set_tx_sender ${deployer}`);
  let defaultEpoch = SDK.getDefaultEpoch();
  // the EpochString type isn't exported atm
  // @ts-ignore
  simnet.setEpoch(getInitialEpoch() || defaultEpoch);

  window.output.innerHTML = "";
  appendOutput("simnet ready", []);
  appendOutput(`current epoch: ${simnet.currentEpoch}`, ["log"]);

  appendOutput("---", []);
  appendOutput("Instructions:", []);
  appendOutput(" ", []);
  appendOutput("type any clarity code below to run it: ", []);
  appendOutput("> (+ u41 u1)", ["log", "instructions"]);
  appendOutput("including contract-calls: ", []);
  appendOutput("> (contract-call? .contract-0 get-count)", [
    "log",
    "instructions",
  ]);
  appendOutput("type ::help to see the available commands: ", []);
  appendOutput("> ::help", ["log", "instructions"]);
  appendOutput(" ", []);
  appendOutput("---", []);

  // deploy initial contract
  deployContract(initialContract);

  // handle console input
  window.input.removeAttribute("disabled");
  window.input.addEventListener("input", handleConsoleInput);
  window.input.addEventListener("change", handleConsoleInput);

  window.run.addEventListener("submit", (e) => {
    e.preventDefault();
    let command = window.input.value;
    if (!command) return;

    executeCommand(command);
    setConsoleInputValue("");
  });

  // handle console history browsing
  window.input.addEventListener("keydown", (e) => {
    if (!e.shiftKey && (e.code === "ArrowUp" || e.code === "ArrowDown")) {
      let command = window.input.value;
      if (command.length > 0 && !isBrowsingHistory) return false;
      if (history.length === 0) return false;

      isBrowsingHistory = true;
      if (e.code === "ArrowUp") {
        const index = currentHistoryIndex - 1;
        if (index < 0) return false;

        e.preventDefault();

        currentHistoryIndex--;
        setConsoleInputValue(history[index]);
      } else if (e.code === "ArrowDown") {
        const index = currentHistoryIndex + 1;
        if (index > history.length) return false;

        e.preventDefault();

        currentHistoryIndex++;
        if (index === history.length) {
          setConsoleInputValue("");
          isBrowsingHistory = false;
          return false;
        }
        setConsoleInputValue(history[index]);
      }

      return false;
    }

    isBrowsingHistory = false;
    currentHistoryIndex = history.length;
  });
}

/**
 *
 * @param {string} initialContract
 */
async function initMonacoEditor(initialContract) {
  const { monaco } = await import("./editor/monaco.js");

  const smallScreenOptions = Object.freeze({
    lineNumbers: "off",
    glyphMargin: false,
    folding: false,
  });
  const normalScreenOptions = Object.freeze({
    lineNumbers: "on",
    glyphMargin: true,
    folding: true,
  });

  // init monaco editor
  const editor = monaco.editor.create(window.editor, {
    value: initialContract,
    language: "clarity",
    automaticLayout: true,
    theme: "vs-dark",
    tabFocusMode: false,
    fontSize: 14,
    minimap: {
      enabled: false,
    },
    ...(window.innerWidth <= 860 ? smallScreenOptions : normalScreenOptions),
  });

  window.addEventListener("resize", () => {
    const showLineNumber = editor.getOption(68).renderType === 1;
    if (window.innerWidth <= 860 && showLineNumber) {
      editor.updateOptions(smallScreenOptions);
    } else if (window.innerWidth > 860 && !showLineNumber) {
      editor.updateOptions(normalScreenOptions);
    }
  });

  editor.onDidFocusEditorText(() => {
    window.editorContainer.classList.add("focus");
  });
  editor.onDidBlurEditorText(() => {
    window.editorContainer.classList.remove("focus");
  });

  window.deploy.addEventListener("click", () => {
    const content = editor.getValue();
    // analytics.track("deploy-contract", { contractLength: content.length });
    deployContract(content);
  });

  window.copyCode.addEventListener("click", () => {
    navigator.clipboard.writeText(editor.getValue());
    markedActionButtonAsClicked(window.copyCode);
  });

  window.copyLink.addEventListener("click", () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/?epoch=${simnet?.currentEpoch}&snippet=${btoa(
        editor.getValue()
      )}`
    );
    markedActionButtonAsClicked(window.copyLink);
  });

  editor.onDidChangeModelContent(() => {
    let value = editor.getValue();
    if (editor.getValue().length === 0) {
      // if the editor is empty, disable the deploy button
      setDeployedStatus(true);
      return;
    }
    localStorage.setItem("contract", value);
    setDeployedStatus(false);
  });

  // global keydown event listener
  window.addEventListener("keydown", (e) => {
    // deploy contract on ctrl + s
    if ((e.metaKey || e.ctrlKey) && e.code === "KeyS") {
      e.preventDefault();
      deployContract(editor.getValue());
    }

    // empty consolle on ctrl + k
    if ((e.metaKey || e.ctrlKey) && e.code === "KeyK") {
      e.preventDefault();
      window.output.innerHTML = "";
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const initialContract = await getInitialContract();
  initClarinetSDK(initialContract);
  initMonacoEditor(initialContract);
});

/**
 * @arg {string} command
 */
function executeCommand(command) {
  if (!simnet) return;

  let trimmedCommand = command.trim();

  let commandType = trimmedCommand.startsWith("::")
    ? "command"
    : "code-snippet";
  let isContractCall =
    commandType === "code-snippet" && trimmedCommand.includes("contract-call?");
  // analytics.track("run-command", {
  //   commandType,
  //   isContractCall,
  // });

  if (history[history.length - 1] !== trimmedCommand) {
    history.push(trimmedCommand);
    if (history.length > 50) {
      history.shift();
    } else {
      currentHistoryIndex++;
    }
    localStorage.setItem("console-history", JSON.stringify(history));
  }

  appendOutput(trimmedCommand, ["command"]);

  try {
    if (trimmedCommand.startsWith("::")) {
      const result = simnet.executeCommand(trimmedCommand);
      appendOutput(result, ["log"]);
      return;
    }
    let { result, events } = simnet.execute(trimmedCommand);
    console.log("events", events);
    appendOutput(Cl.prettyPrint(result), ["success"]);
  } catch (e) {
    if (typeof e === "string") {
      appendOutput(e, ["error"]);
    } else {
      console.warn("error", e);
    }
  }
}

/**
 * @param {string} content
 */
function deployContract(content) {
  if (!simnet) return;
  if (deployed) {
    appendOutput("contract already deployed", ["log"]);
    return;
  }

  const contractName = `contract-${contractDeployed}`;
  const clarityVersionString = simnet.getDefaultClarityVersionForCurrentEpoch();
  const clarityVersion = parseInt(clarityVersionString.replace("Clarity ", ""));

  try {
    const { result } = simnet.deployContract(
      contractName,
      content,
      // @ts-ignore
      { clarityVersion },
      deployer
    );

    appendOutput(`contract deployed: .${contractName}`, ["log"]);
    appendOutput(Cl.prettyPrint(result), ["success"]);
    contractDeployed++;
  } catch (e) {
    if (typeof e === "string") {
      appendOutput(e, ["error"]);
    }
  }
  setDeployedStatus(true);
}

/**
 *
 * @param {HTMLButtonElement} button
 */
function markedActionButtonAsClicked(button) {
  button.classList.add("clicked");
  button.setAttribute("disabled", "true");
  window.setTimeout(() => {
    button.classList.remove("clicked");
    button.removeAttribute("disabled");
  }, 1000);
}

/**
 * @param {string} text
 * @param {string[]} classes
 */
function appendOutput(text, classes = []) {
  let outputPre = document.createElement("pre");
  for (const className of classes) {
    outputPre.classList.add(className);
  }
  outputPre.append(text);
  window.output.append(outputPre);
  window.output.scrollTop = window.output.scrollHeight;
}

/**
 * @param {boolean} newStatus
 */
function setDeployedStatus(newStatus) {
  if (deployed === newStatus) return;
  if (newStatus) {
    deployed = true;
    window.deploy.setAttribute("disabled", "true");
  } else {
    deployed = false;
    window.deploy.removeAttribute("disabled");
  }
}

/**
 * @param {string} value
 */
function setConsoleInputValue(value) {
  const input = window.input;
  input.value = value;
  handleConsoleInput();
  // move cursor to the end of the input
  const end = input.value.length;
  input.setSelectionRange(end, end);
}

/** */
function handleConsoleInput() {
  if (window.input.value.length === 0) {
    window.runButton.setAttribute("disabled", "true");
  } else {
    window.runButton.removeAttribute("disabled");
  }
}

// should only be called once
// could be memoized in the future to enforce it
async function getInitialContract() {
  if (window.location.search.includes("snippet=")) {
    const params = new URLSearchParams(window.location.search);
    const snippet = params.get("snippet");
    if (snippet) {
      return atob(snippet);
    }
  }

  const contract = localStorage.getItem("contract");
  if (contract) return contract;

  const { counter } = await import("./samples/contract.js");
  return counter;
}

const validEpochs = ["2.0", "2.05", "2.1", "2.2", "2.3", "2.4", "2.5", "3.0"];
function getInitialEpoch() {
  const params = new URLSearchParams(window.location.search);
  const epoch = params.get("epoch");
  if (epoch && validEpochs.includes(epoch)) return epoch;
  return null;
}
