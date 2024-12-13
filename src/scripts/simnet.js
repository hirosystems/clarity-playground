import { Cl } from "@stacks/transactions";

import {
  addCommandToHistory,
  appendOutput,
  setEpochInSearchParams,
  setUpConsoleEventsListeners,
  showStartMessage,
} from "./console.js";

let contractDeployed = 0;

let deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
let wallet_1 = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5";
let wallet_2 = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG";
let wallet_3 = "ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC";

let deployed = false;

/** @type {import("@hirosystems/clarinet-sdk-browser").Simnet | null} */
export let simnet = null;

/**
 * @param {string} initialContract
 * @param {string | null} initialEpoch
 */
export async function initClarinetSDK(initialContract, initialEpoch) {
  const { initSimnet, SDK } = await import("@hirosystems/clarinet-sdk-browser");

  // init simnet
  simnet = await initSimnet();
  await simnet.initEmptySession();

  [deployer, wallet_1, wallet_2, wallet_3].forEach((address) => {
    // @ts-ignore
    simnet.mintSTX(address, 1000000000n);
  });

  simnet.executeCommand(`::set_tx_sender ${deployer}`);
  let defaultEpoch = SDK.getDefaultEpoch();
  // the EpochString type isn't exported atm
  // @ts-ignore
  simnet.setEpoch(initialEpoch || defaultEpoch);

  const currentEpoch = simnet.currentEpoch;
  setEpochInSearchParams(currentEpoch);

  showStartMessage(currentEpoch);

  deployContract(initialContract);

  window.run.addEventListener("submit", (e) => {
    e.preventDefault();
    let command = window.input.value;
    if (!command) return;

    executeCommand(command);
  });

  setUpConsoleEventsListeners();

  return simnet;
}

/**
 * @arg {string} command
 */
function executeCommand(command) {
  if (!simnet) return;

  let trimmedCommand = command.trim();
  if (!trimmedCommand) return;

  addCommandToHistory(trimmedCommand);

  appendOutput(trimmedCommand, ["command"]);

  try {
    if (trimmedCommand.startsWith("::")) {
      const result = simnet.executeCommand(trimmedCommand);

      if (
        trimmedCommand.startsWith("::set_epoch") &&
        result.startsWith("Epoch updated to")
      ) {
        setEpochInSearchParams(simnet.currentEpoch);
      }

      appendOutput(result, ["log"]);
      return;
    }
    let { result, events } = simnet.execute(trimmedCommand);
    console.log("events", events);
    appendOutput(Cl.prettyPrint(result, 2), ["success"]);
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
export function deployContract(content) {
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
    appendOutput(Cl.prettyPrint(result, 2), ["success"]);
    contractDeployed++;
  } catch (e) {
    if (typeof e === "string") {
      appendOutput(e, ["error"]);
    }
  }
  setDeployedStatus(true);
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
