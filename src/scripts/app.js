import { initMonacoEditor } from "./editor.js";
import { initClarinetSDK } from "./simnet.js";

let initialSearchString = window.location.search;

document.addEventListener("DOMContentLoaded", async () => {
  const initialContract = await getInitialContract();
  const initialEpoch = getInitialEpoch();

  const url = new URL(window.location.href);
  url.searchParams.delete("snippet");
  window.history.replaceState(null, "", url.toString());

  initClarinetSDK(initialContract, initialEpoch);
  initMonacoEditor(initialContract);
});

// get initial contract from URL or local storage
async function getInitialContract() {
  if (initialSearchString.includes("snippet=")) {
    const params = new URLSearchParams(initialSearchString);
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

// get initial epoch from URL
const validEpochs = ["2.0", "2.05", "2.1", "2.2", "2.3", "2.4", "2.5", "3.0"];
function getInitialEpoch() {
  const params = new URLSearchParams(initialSearchString);
  const epoch = params.get("epoch");
  if (epoch && validEpochs.includes(epoch)) return epoch;
  return null;
}
