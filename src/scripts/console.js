import { Cl } from "@stacks/transactions";

let storedHistory = localStorage.getItem("console-history");
let parsdedHistory = storedHistory ? JSON.parse(storedHistory) : null;
/** @type string[] */
let history = parsdedHistory || ["(contract-call? .contract-0 get-count)"];
let currentHistoryIndex = history.length;
let isBrowsingHistory = false;

export function setUpConsoleEventsListeners() {
  window.input.removeAttribute("disabled");
  window.input.addEventListener("input", handleConsoleInput);
  window.input.addEventListener("change", handleConsoleInput);

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
        setCommandInputValue(history[index]);
      } else if (e.code === "ArrowDown") {
        const index = currentHistoryIndex + 1;
        if (index > history.length) return false;

        e.preventDefault();

        currentHistoryIndex++;
        if (index === history.length) {
          setCommandInputValue("");
          isBrowsingHistory = false;
          return false;
        }
        setCommandInputValue(history[index]);
      }

      return false;
    }

    isBrowsingHistory = false;
    currentHistoryIndex = history.length;
  });
}

/**
 * @param {string} currentEpoch
 */
export function showStartMessage(currentEpoch) {
  window.output.innerHTML = "";
  appendOutput(`current epoch: ${currentEpoch}`, ["log"]);

  appendOutput("---", []);
  appendOutput("type any clarity code below to run it: ", []);
  appendOutput("> (+ u41 u1)", ["log", "instructions"]);
  appendOutput("including contract-calls: ", []);
  appendOutput("> (contract-call? .contract-0 get-count)", [
    "log",
    "instructions",
  ]);
  appendOutput("type ::help to see the available commands: ", []);
  appendOutput("> ::help", ["log", "instructions"]);
  appendOutput("---", []);
}

/**
 * @param {string} command
 */
export function addCommandToHistory(command) {
  if (history[history.length - 1] !== command) {
    history.push(command);
    if (history.length > 50) {
      history.shift();
    } else {
      currentHistoryIndex++;
    }
    localStorage.setItem("console-history", JSON.stringify(history));
  }
  setCommandInputValue("");
}

/**
 * @arg {import("@hirosystems/clarinet-sdk-browser").Simnet | null} simnet
 * @arg {string} command
 */
export function executeCommand(simnet, command) {
  if (!simnet) return;

  let trimmedCommand = command.trim();
  if (!trimmedCommand) return;

  appendOutput(trimmedCommand, ["command"]);

  try {
    if (trimmedCommand.startsWith("::")) {
      const result = simnet.executeCommand(trimmedCommand);
      console.log("result", result);
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
 * @param {string} text
 * @param {string[]} classes
 */
export function appendOutput(text, classes = []) {
  let outputPre = document.createElement("pre");
  for (const className of classes) {
    outputPre.classList.add(className);
  }
  outputPre.append(text);
  window.output.append(outputPre);
  window.output.scrollTop = window.output.scrollHeight;
}

/**
 * @param {string} value
 */
function setCommandInputValue(value) {
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

/**
 * @param {string} epoch
 */
export function setEpochInSearchParams(epoch) {
  const url = new URL(window.location.href);
  url.searchParams.set("epoch", epoch);
  window.history.replaceState(null, "", url.toString());
}
