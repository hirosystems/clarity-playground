/**
 * @param {import("monaco-editor")} monaco
 */
export function configLanguage(monaco) {
  monaco.languages.register({
    id: "clarity",
    extensions: [".clar"],
  });
  monaco.languages.setLanguageConfiguration("clarity", {
    wordPattern: /(-?\d*\.\d\w*)|([^`~!#%^&*()=+\[{\]}\\|;:'",>?\s]+)/g, // eslint-disable-line
    comments: {
      lineComment: ";;",
    },
    brackets: [["(", ")"]],
    autoClosingPairs: [
      {
        open: "(",
        close: ")",
      },
      {
        open: '"',
        close: '"',
      },
      {
        open: "{",
        close: "}",
      },
    ],
    surroundingPairs: [
      { open: "(", close: ")" },
      {
        open: "{",
        close: "}",
      },
      { open: '"', close: '"' },
    ],
  });
}
