/* @ts-ignore */
import editorWorker from "https://esm.sh/monaco-editor@0.49/esm/vs/editor/editor.worker?worker";
/* @ts-ignore */
import jsonWorker from "https://esm.sh/monaco-editor@0.49/esm/vs/language/json/json.worker?worker";
/* @ts-ignore */
import cssWorker from "https://esm.sh/monaco-editor@0.49/esm/vs/language/css/css.worker?worker";
/* @ts-ignore */
import htmlWorker from "https://esm.sh/monaco-editor@0.49/esm/vs/language/html/html.worker?worker";
/* @ts-ignore */
import tsWorker from "https://esm.sh/monaco-editor@0.49/esm/vs/language/typescript/ts.worker?worker";

import * as monaco from "https://esm.sh/monaco-editor@0.49";
import { Registry } from "https://esm.sh/monaco-textmate@3";
import { wireTmGrammars } from "https://esm.sh/monaco-editor-textmate@4";

import { loadWASM } from "https://esm.sh/onigasm@2";

import { claritySyntax } from "./clarity-syntax.js";
import theme from "./theme.js";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

monaco.editor.defineTheme("vs-dark", theme);
monaco.languages.register({ id: "clarity" });

(async function initClaritySyntax() {
  await loadWASM("https://esm.sh/onigasm/lib/onigasm.wasm");
  const registry = new Registry({
    getGrammarDefinition: () =>
      Promise.resolve({
        format: "json",
        content: claritySyntax,
      }),
  });

  const grammars = new Map();
  grammars.set("clarity", "source.clarity");
  await wireTmGrammars(monaco, registry, grammars);
})();

export default monaco;
