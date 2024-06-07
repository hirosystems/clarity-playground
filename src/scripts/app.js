import { initSimnet } from "https://esm.sh/@hirosystems/clarinet-sdk-browser@beta";
import { Cl } from "https://esm.sh/@stacks/transactions@6.15";

import "./editor/monaco.js";
import { counter } from "./samples/contract.js";
import monaco from "./editor/monaco.js";

let contractDeployed = 0;

let transient = "ST000000000000000000002AMW42H";
let deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

let storedHistory = localStorage.getItem("console-history");
let parsdedHistory = storedHistory ? JSON.parse(storedHistory) : null;
/** @type string[] */
let history = parsdedHistory || [
  "(contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.contract-0 get-count)",
];
let currentHistoryIndex = history.length;
let isBrowsingHistory = false;

let undeployed = true;

(async function main() {
  // init simnet
  const simnet = await initSimnet();
  await simnet.initEmtpySession();
  console.log("simnet.accounts", simnet.getAccounts());

  // @ts-ignore
  simnet.mintSTX(deployer, 1000000000n);
  // @ts-ignore
  simnet.mintSTX(transient, 1000000000n);

  simnet.setEpoch("3.0");

  window.output.innerHTML = `simnet ready<br />current epoch: ${simnet.currentEpoch}`;

  // deploy initial contract
  deployContract(simnet, counter);

  // init monaco editor
  const editor = monaco.editor.create(window.editor, {
    value: counter,
    language: "clarity",
    automaticLayout: true,
    theme: "vs-dark",
    minimap: {
      enabled: false,
    },
  });

  window.deploy.addEventListener("click", () =>
    deployContract(simnet, editor.getValue())
  );

  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.code === "KeyS") {
      e.preventDefault();
      deployContract(simnet, editor.getValue());
    }
  });

  editor.onDidChangeModelContent(() => {
    if (!undeployed) undeployed = true;
  });

  // handle console input
  window.run.addEventListener("submit", (e) => {
    e.preventDefault();
    let command = window.input.value;
    if (!command) return;

    executeCommand(simnet, command);
    window.input.value = "";
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
        window.input.value = history[index];
        focusEndOfInput();
      } else if (e.code === "ArrowDown") {
        const index = currentHistoryIndex + 1;
        if (index > history.length) return false;

        e.preventDefault();

        currentHistoryIndex++;
        if (index === history.length) {
          window.input.value = "";
          isBrowsingHistory = false;
          return false;
        }
        window.input.value = history[index];
        focusEndOfInput();
      }

      return false;
    }

    isBrowsingHistory = false;
    currentHistoryIndex = history.length;
  });
})();

/**
 * @arg {import("@hirosystems/clarinet-sdk-browser").Simnet} simnet
 * @arg {string} command
 */
function executeCommand(simnet, command) {
  if (history[history.length - 1] !== command) {
    history.push(command);
    if (history.length > 50) {
      history.shift();
    }
    localStorage.setItem("console-history", JSON.stringify(history));
    currentHistoryIndex++;
  }

  appendOutput(command, ["command"]);

  try {
    let { result, events } = simnet.execute(command);
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
 * @param {import("@hirosystems/clarinet-sdk-browser").Simnet} simnet
 * @param {string} content
 * @returns
 */
function deployContract(simnet, content) {
  if (!undeployed) {
    appendOutput("contract already deployed", ["log"]);
    return;
  }

  const contractName = `contract-${contractDeployed}`;

  try {
    const { result } = simnet.deployContract(
      contractName,
      content,
      { clarityVersion: 3 },
      deployer
    );

    appendOutput(`contract deployed: '${deployer}.${contractName}`, []);
    appendOutput(Cl.prettyPrint(result), ["success"]);
    contractDeployed++;
  } catch (e) {
    if (typeof e === "string") {
      appendOutput(e, ["error"]);
    }
  }
  undeployed = false;
}

/**
 * @param {string} text
 * @param {string[]} classes
 */
function appendOutput(text, classes = []) {
  let oututDiv = document.createElement("div");
  for (const className of classes) {
    oututDiv.classList.add(className);
  }
  oututDiv.innerText = text;
  window.output.append(oututDiv);
  window.output.scrollTop = window.output.scrollHeight;
}

function focusEndOfInput() {
  const input = window.input;
  const end = input.value.length;
  input.setSelectionRange(end, end);
}
