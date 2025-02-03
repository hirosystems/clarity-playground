import { Cl } from "@stacks/transactions";

import {
  addCommandToHistory,
  appendOutput,
  setEpochInSearchParams,
  setUpConsoleEventsListeners,
  showStartMessage,
} from "./console.js";

let deployed = false;

/**
 * @typedef InitOptions
 * @property {boolean} remoteData
 * @property {number | null} initialHeight
 * @property {string | null} epoch
 */

/**
 * @type {Worker | null}
 */
let simnetWorker = null;

/**
 * @typedef SimnetWorkerMessage
 * @property {string} action
 * @property {any} data
 */

/**
 * @param {string} initialContract
 * @param {InitOptions} params
 */
export async function initClarinetSDK(initialContract, params) {
  simnetWorker = new Worker("/src/scripts/simnet-worker.js", {
    type: "module",
  });

  /**
   * @param {MessageEvent<SimnetWorkerMessage>} e
   */
  simnetWorker.onmessage = (e) => {
    const { action, data } = e.data;
    if (action === "initialized") {
      showStartMessage(data.currentEpoch);
      setEpochInSearchParams(data.currentEpoch);
      if (!simnetWorker) return;
      simnetWorker.postMessage({
        action: "deployContract",
        data: {
          content: initialContract,
        },
      });
    } else if (action === "appendOutput") {
      appendOutput(data.output, data.classes);
    } else if (action === "appendClarityResult") {
      appendOutput(Cl.prettyPrint(data.value, 2), data.classes);
    } else if (action === "setEpoch") {
      setEpochInSearchParams(data.newEpoch);
    } else if (action === "setDeployedStatus") {
      setDeployedStatus(data.newStatus);
    } else {
      console.warn("invalid event", e);
    }
  };

  simnetWorker.postMessage({
    action: "init",
    data: {
      remoteData: params.remoteData,
      initialHeight: params.initialHeight,
      initialEpoch: params.epoch,
    },
  });

  window.run.addEventListener("submit", (e) => {
    e.preventDefault();
    let command = window.input.value;
    if (!command) return;

    executeCommand(command);
  });

  setUpConsoleEventsListeners();
}

/**
 * @arg {string} command
 */
function executeCommand(command) {
  if (!simnetWorker) return;
  let trimmedCommand = command.trim();
  if (!trimmedCommand) return;

  addCommandToHistory(trimmedCommand);

  appendOutput(trimmedCommand, ["command"]);

  simnetWorker.postMessage({
    action: "executeCommand",
    data: {
      command: trimmedCommand,
    },
  });
}

/**
 * @param {string} content
 */
export function deployContract(content) {
  if (!simnetWorker) return;
  if (deployed) {
    appendOutput("contract already deployed", ["log"]);
    return;
  }

  simnetWorker.postMessage({
    action: "deployContract",
    data: {
      content,
    },
  });
}

/**
 * @param {boolean} newStatus
 */
export function setDeployedStatus(newStatus) {
  if (deployed === newStatus) return;
  if (newStatus) {
    deployed = true;
    window.deploy.setAttribute("disabled", "true");
  } else {
    deployed = false;
    window.deploy.removeAttribute("disabled");
  }
}
