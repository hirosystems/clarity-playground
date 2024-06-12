import { initSimnet } from "https://esm.sh/@hirosystems/clarinet-sdk-browser@beta";
import { Cl } from "https://esm.sh/@stacks/transactions@6.15";

import "./editor/monaco.js";
import { counter } from "./samples/contract.js";
import monaco from "./editor/monaco.js";

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

let undeployed = true;

(async function main() {
  // init simnet
  const simnet = await initSimnet();
  await simnet.initEmtpySession();

  [deployer, wallet_1, wallet_2, wallet_3].forEach((address) => {
    // @ts-ignore
    simnet.mintSTX(address, 1000000000n);
  });

  simnet.executeCommand(`::set_tx_sender ${deployer}`);
  simnet.setEpoch("3.0");

  window.output.innerHTML = "";
  appendOutput("simnet ready", []);
  appendOutput(`current epoch: ${simnet.currentEpoch}"`, ["log"]);

  appendOutput("---", []);
  appendOutput("Instructions: ", []);
  appendOutput("type any clarity code below to run it: ", []);
  appendOutput("> (+ u41 u1)", ["log", "instructions"]);
  appendOutput("including contract-calls: ", []);
  appendOutput("> (contract-call? .contract-0 get-count)", [
    "log",
    "instructions",
  ]);
  appendOutput("---", []);

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

    if ((e.metaKey || e.ctrlKey) && e.code === "KeyK") {
      e.preventDefault();
      window.output.innerHTML = "";
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
  undeployed = false;
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

function focusEndOfInput() {
  const input = window.input;
  const end = input.value.length;
  input.setSelectionRange(end, end);
}
