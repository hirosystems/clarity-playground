import { compressAndEncode } from "./base64.js";
import { deployContract, setDeployedStatus } from "./simnet.js";

/**
 * @param {string} initialContract
 */
export async function initMonacoEditor(initialContract) {
  const { monaco } = await import("./monaco/monaco.js");

  const smallScreenOptions = Object.freeze({
    lineNumbers: "off",
    glyphMargin: false,
    folding: false,
  });
  const normalScreenOptions = Object.freeze({
    lineNumbers: "on",
    glyphMargin: true,
    folding: true,
  });

  // init monaco editor
  const editor = monaco.editor.create(window.editor, {
    value: initialContract,
    language: "clarity",
    automaticLayout: true,
    theme: "vs-dark",
    tabFocusMode: false,
    fontSize: 14,
    fontFamily:
      "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
    fontWeight: "normal",
    minimap: {
      enabled: false,
    },
    ...(window.innerWidth <= 860 ? smallScreenOptions : normalScreenOptions),
  });

  window.addEventListener("resize", () => {
    const showLineNumber = editor.getOption(68).renderType === 1;
    if (window.innerWidth <= 860 && showLineNumber) {
      editor.updateOptions(smallScreenOptions);
    } else if (window.innerWidth > 860 && !showLineNumber) {
      editor.updateOptions(normalScreenOptions);
    }
  });

  editor.onDidFocusEditorText(() => {
    window.editorContainer.classList.add("focus");
  });
  editor.onDidBlurEditorText(() => {
    window.editorContainer.classList.remove("focus");
  });

  window.deploy.addEventListener("click", () => {
    const content = editor.getValue();
    deployContract(content);
  });

  window.copyCode.addEventListener("click", () => {
    navigator.clipboard.writeText(editor.getValue());
    markedActionButtonAsClicked(window.copyCode);
  });

  window.copyLink.addEventListener("click", () => {
    const search = window.location.search || "?";
    const snippet = compressAndEncode(editor.getValue());
    const newUrl = `${window.location.origin}/${search}&snippet=${snippet}`;
    navigator.clipboard.writeText(newUrl);
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

  return editor;
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
  }, 1000);
}
