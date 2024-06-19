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

async function initClarinetSDK() {
  const { initSimnet } = await import("@hirosystems/clarinet-sdk-browser");

  // init simnet
  simnet = await initSimnet();
  await simnet.initEmtpySession();

  [deployer, wallet_1, wallet_2, wallet_3].forEach((address) => {
    // @ts-ignore
    simnet.mintSTX(address, 1000000000n);
  });

  simnet.executeCommand(`::set_tx_sender ${deployer}`);
  simnet.setEpoch("2.4");

  window.output.innerHTML = "";
  appendOutput("simnet ready", []);
  appendOutput(`current epoch: ${simnet.currentEpoch}"`, ["log"]);

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
  deployContract(await loadInitialContract());

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

async function initMonacoEditor() {
  const { monaco } = await import("./editor/monaco.js");

  const initialContract = await loadInitialContract();

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
  });

  editor.onDidFocusEditorText(() => {
    window.editorContainer.classList.add("focus");
  });
  editor.onDidBlurEditorText(() => {
    window.editorContainer.classList.remove("focus");
  });

  window.deploy.addEventListener("click", () =>
    deployContract(editor.getValue())
  );

  window.copyCode.addEventListener("click", () => {
    navigator.clipboard.writeText(editor.getValue());
    markedActionButtonAsClicked(window.copyCode);
  });

  window.copyLink.addEventListener("click", () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/?snippet=${btoa(editor.getValue())}`
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

document.addEventListener("DOMContentLoaded", () => {
  initClarinetSDK();
  initMonacoEditor();
});

/**
 * @arg {string} command
 */
function executeCommand(command) {
  if (!simnet) return;
  if (history[history.length - 1] !== command) {
    history.push(command);
    if (history.length > 50) {
      history.shift();
    } else {
      currentHistoryIndex++;
    }
    localStorage.setItem("console-history", JSON.stringify(history));
  }

  appendOutput(command, ["command"]);

  try {
    if (command.startsWith("::")) {
      const result = simnet.executeCommand(command);
      appendOutput(result, ["log"]);
      return;
    }
    let { result, events } = simnet.execute(command);
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

  try {
    const { result } = simnet.deployContract(
      contractName,
      content,
      null,
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
  }, 600);
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

async function loadInitialContract() {
  if (window.location.search.includes("snippet=")) {
    const params = new URLSearchParams(window.location.search);
    const snippet = params.get("snippet");
    if (snippet) {
      window.location.search = "";
      return atob(snippet);
    }
  }

  const contract = localStorage.getItem("contract");
  if (contract) return contract;

  const { counter } = await import("./samples/contract.js");
  return counter;
}
