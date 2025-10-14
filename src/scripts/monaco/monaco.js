/* @ts-ignore */
import editorWorker from "https://esm.sh/monaco-editor@0.54.0/esm/vs/editor/editor.worker?worker";

import * as monaco from "monaco-editor";
import { Registry } from "monaco-textmate";
import { wireTmGrammars } from "monaco-editor-textmate";
import { loadWASM } from "onigasm";

import { claritySyntax } from "./clarity-syntax.js";
import { configLanguage } from "./clarity-language.js";
import theme from "./theme.js";

self.MonacoEnvironment = {
  getWorker(_, _label) {
    return new editorWorker();
  },
};

monaco.editor.defineTheme("vs-dark", theme);
configLanguage(monaco);

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

export { monaco };
