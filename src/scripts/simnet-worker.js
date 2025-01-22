let contractDeployed = 0;

let deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
let wallet_1 = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5";
let wallet_2 = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG";
let wallet_3 = "ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC";

let deployed = false;

/** @import { Simnet } from "@hirosystems/clarinet-sdk-browser" */

/** @type {Simnet | null} */
let simnet = null;

/**
 * @typedef SimnetWorkerMessage
 * @property {string} action
 * @property {any} data
 */

/**
 * @param {MessageEvent<SimnetWorkerMessage>} e
 */
onmessage = (e) => {
  const { action, data } = e.data;
  if (action === "init") {
    initClarinetSDK(data.initialEpoch);
  } else if (action === "deployContract") {
    deployContract(data.content);
  } else if (action === "executeCommand") {
    executeCommand(data.command);
  } else {
    console.warn("invalid event", e);
  }
};

/**
 * @param {string} output
 * @param {string[]} classes
 */
function postOutput(output, classes) {
  postMessage({
    action: "appendOutput",
    data: {
      output,
      classes,
    },
  });
}

/**
 * @param {any} value
 * @param {string[]} classes
 */
function postClarityResult(value, classes) {
  postMessage({
    action: "appendClarityResult",
    data: {
      value,
      classes,
    },
  });
}

/**
 * @param {string | null} initialEpoch
 */
export async function initClarinetSDK(initialEpoch) {
  const { initSimnet, SDK } = await import(
    // @ts-ignore
    "https://esm.sh/@hirosystems/clarinet-sdk-browser@2.13.0-beta3"
  );

  // init simnet
  simnet = /** @type {Simnet} */ (await initSimnet());
  await simnet.initEmptySession({
    enabled: true, // testing purpose, do not merge
    // enabled: false,
    api_url: "https://api.testnet.hiro.so",
    initial_height: 62000,
  });

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
  postMessage({
    action: "initialized",
    data: {
      currentEpoch,
    },
  });
}

/**
 * @arg {string} command
 */
function executeCommand(command) {
  if (!simnet) return;

  try {
    if (command.startsWith("::")) {
      const result = simnet.executeCommand(command);

      if (
        command.startsWith("::set_epoch") &&
        result.startsWith("Epoch updated to")
      ) {
        postMessage({
          action: "setEpoch",
          data: {
            newEpoch: simnet.currentEpoch,
          },
        });
      }

      postOutput(result, ["log"]);
      return;
    }
    let { result, events } = simnet.execute(command);
    console.log("events", events);
    postClarityResult(result, ["success"]);
  } catch (e) {
    if (typeof e === "string") {
      postOutput(e, ["error"]);
    } else {
      console.warn("error", e);
    }
  }
}

/**
 * @param {string} content
 * @returns {boolean}
 */
export function deployContract(content) {
  if (!simnet) return false;
  if (deployed) {
    postOutput("contract already deployed", ["log"]);
    return false;
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
      deployer,
    );

    postOutput(`contract deployed: .${contractName}`, ["log"]);
    postClarityResult(result, ["success"]);
    contractDeployed++;
  } catch (e) {
    if (typeof e === "string") {
      postOutput(e, ["error"]);
    }
  }
  postMessage({
    action: "setDeployedStatus",
    data: {
      newStatus: true,
    },
  });
  return true;
}
