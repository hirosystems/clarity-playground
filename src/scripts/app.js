import { decodeAndDecompress } from "./base64.js";
import { initMonacoEditor } from "./editor.js";
import { initClarinetSDK } from "./simnet.js";

let initialSearchString = window.location.search;

document.addEventListener("DOMContentLoaded", async () => {
  const initialContract = await getInitialContract();
  const params = getSearchParams();

  const url = new URL(window.location.href);
  url.searchParams.delete("snippet");
  window.history.replaceState(null, "", url.toString());

  initClarinetSDK(initialContract, params);
  initMonacoEditor(initialContract);
});

// get initial contract from URL or local storage
async function getInitialContract() {
  if (initialSearchString.includes("snippet=")) {
    const params = new URLSearchParams(initialSearchString);
    const snippet = params.get("snippet");
    if (snippet) {
      return decodeAndDecompress(snippet);
    }
  }

  const contract = localStorage.getItem("contract");
  if (contract) return contract;

  const { counter } = await import("./samples/contract.js");
  return counter;
}

const validEpochs = [
  "2.0",
  "2.05",
  "2.1",
  "2.2",
  "2.3",
  "2.4",
  "2.5",
  "3.0",
  "3.1",
  "3.2",
  "3.3",
];

function getSearchParams() {
  const params = new URLSearchParams(initialSearchString);

  const remoteData = params.get("remote_data") === "true";
  const initialHeight = remoteData ? params.get("initial_height") : null;
  const epoch = remoteData ? null : params.get("epoch");

  return {
    remoteData,
    initialHeight:
      initialHeight && !isNaN(parseInt(initialHeight))
        ? parseInt(initialHeight)
        : null,
    epoch: epoch && validEpochs.includes(epoch) ? epoch : null,
  };
}
