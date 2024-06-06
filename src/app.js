import { initSimnet } from "https://esm.sh/@hirosystems/clarinet-sdk-browser@beta";
import { Cl } from "https://esm.sh/@stacks/transactions@6.15.0";
import * as monaco from "https://esm.sh/monaco-editor@0.49.0";

import "./monaco.js";
import { counter } from "./samples/contract.js";

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

  simnet.setEpoch("2.5");
  const currentEpoch = simnet.currentEpoch;

  window.output.innerHTML = `simnet ready<br />current epoch: ${currentEpoch}`;

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

  function deployContract() {
    if (!undeployed) {
      appendOutput("contract already deployed", ["log"]);
      return;
    }
    const content = editor.getValue();
    console.log("Editor content:", content);

    // console.log("simnet.deployer", simnet.deployer);
    const { result } = simnet.deployContract(
      `contract-${contractDeployed}`,
      content,
      null,
      deployer
    );

    appendOutput(`contract deployed: contract-${contractDeployed}`, []);
    appendOutput(Cl.prettyPrint(result), ["success"]);
    contractDeployed++;
    undeployed = false;
  }

  window.deploy.addEventListener("click", deployContract);

  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.code === "KeyS") {
      e.preventDefault();
      deployContract();
    }
  });

  deployContract();

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
    localStorage.setItem("console-history", JSON.stringify(history));
    currentHistoryIndex++;
  }

  appendOutput(command, ["command"]);

  try {
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
}

/**
 *
 */
function focusEndOfInput() {
  const input = window.input;
  const end = input.value.length;
  input.setSelectionRange(end, end);
}
