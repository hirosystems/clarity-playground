interface Window {
  editor: HTMLDivElement;
  output: HTMLDivElement;
  run: HTMLFormElement;
  input: HTMLInputElement;
  deploy: HTMLButtonElement;
}

declare module "https://esm.sh/@hirosystems/clarinet-sdk-browser@beta" {
  import clarinet from "@hirosystems/clarinet-sdk-browser";
  export = clarinet;
}

declare module "https://esm.sh/@stacks/transactions@6.15.0" {
  import transactions from "@stacks/transactions";
  export = transactions;
}

declare module "https://esm.sh/monaco-editor@0.49.0" {
  import monaco from "monaco-editor";
  export = monaco;
}
