interface Window {
  editor: HTMLDivElement;
  editorContainer: HTMLDivElement;
  output: HTMLDivElement;
  run: HTMLFormElement;
  runButton: HTMLButtonElement;
  input: HTMLInputElement;
  deploy: HTMLButtonElement;
}

declare module "https://esm.sh/@hirosystems/clarinet-sdk-browser@beta" {
  import clarinet from "@hirosystems/clarinet-sdk-browser";
  export = clarinet;
}

declare module "https://esm.sh/@stacks/transactions@6.15" {
  import transactions from "@stacks/transactions";
  export = transactions;
}

declare module "https://esm.sh/onigasm@2" {
  import onigasm from "onigasm";
  export = onigasm;
}

declare module "https://esm.sh/monaco-editor@0.49" {
  import monaco from "monaco-editor";
  export = monaco;
}

declare module "https://esm.sh/monaco-textmate@3" {
  import monacoTM from "monaco-textmate";
  export = monacoTM;
}

declare module "https://esm.sh/monaco-editor-textmate@4" {
  import monacoEditorTM from "monaco-editor-textmate";
  export = monacoEditorTM;
}
