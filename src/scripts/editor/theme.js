/** @type {import("monaco-editor").editor.IStandaloneThemeData} */
export default {
  inherit: true,
  base: "vs-dark",
  colors: {
    "activityBar.background": "#2f333d",
    "activityBar.foreground": "#d7dae0",
    "activityBarBadge.background": "#528bff",
    "activityBarBadge.foreground": "#f8fafd",
    "button.background": "#528bff",
    "diffEditor.insertedTextBackground": "#00809b33",
    "dropdown.background": "#1d1f23",
    "dropdown.border": "#181a1f",
    "editor.background": "#12171a",
    "editor.findMatchBackground": "#42557b",
    "editor.findMatchHighlightBackground": "#314365",
    "editor.lineHighlightBackground": "#24272c",
    "editor.selectionBackground": "#3e4451",
    "editorCursor.foreground": "#f8f8f0",
    "editorError.foreground": "#c24038",
    "editorGroup.emptyBackground": "#181a1f",
    "editorGroup.border": "#181a1f",
    "editorGroupHeader.tabsBackground": "#21252b",
    "editorIndentGuide.background": "#3b4048",
    "editorHoverWidget.background": "#21252b",
    "editorHoverWidget.border": "#181a1f",
    "editorLineNumber.foreground": "#495162",
    "editorRuler.foreground": "#484848",
    "editorSuggestWidget.background": "#21252b",
    "editorSuggestWidget.border": "#181a1f",
    "editorSuggestWidget.selectedBackground": "#2c313a",
    "editorUnnecessaryCode.opacity": "#000000c0",
    "editorWhitespace.foreground": "#484a50",
    "editorWidget.background": "#21252b",
    "input.background": "#1d1f23",
    "list.activeSelectionBackground": "#2c313a",
    "list.activeSelectionForeground": "#d7dae0",
    "list.focusBackground": "#24272c",
    "list.highlightForeground": "#c5c5c5",
    "list.hoverBackground": "#292d35",
    "list.inactiveSelectionBackground": "#2c313a",
    "list.inactiveSelectionForeground": "#d7dae0",
    "notifications.background": "#21252b",
    "scrollbarSlider.activeBackground": "#747d9180",
    "scrollbarSlider.background": "#4e566680",
    "scrollbarSlider.hoverBackground": "#5a637580",
    "sideBar.background": "#21252b",
    "sideBarSectionHeader.background": "#282c34",
    "statusBar.background": "#21252b",
    "statusBar.foreground": "#9da5b4",
    "statusBarItem.hoverBackground": "#2c313a",
    "statusBar.noFolderBackground": "#21252b",
    "statusBar.debuggingBackground": "#21252b",
    "tab.activeBackground": "#24272c",
    "tab.border": "#181a1f",
    "tab.inactiveBackground": "#21252b",
    "terminal.foreground": "#abb2bf",
    "terminal.ansiBlack": "#2d3139",
    "terminal.ansiBlue": "#528bff",
    "terminal.ansiGreen": "#98c379",
    "terminal.ansiYellow": "#e5c07b",
    "terminal.ansiCyan": "#56b6c2",
    "terminal.ansiMagenta": "#c678dd",
    "terminal.ansiRed": "#e06c75",
    "terminal.ansiWhite": "#d7dae0",
    "terminal.ansiBrightBlack": "#7f848e",
    "terminal.ansiBrightBlue": "#528bff",
    "terminal.ansiBrightGreen": "#98c379",
    "terminal.ansiBrightYellow": "#e5c07b",
    "terminal.ansiBrightCyan": "#56b6c2",
    "terminal.ansiBrightMagenta": "#7e0097",
    "terminal.ansiBrightRed": "#f44747",
    "terminal.ansiBrightWhite": "#d7dae0",
    "titleBar.activeBackground": "#282c34",
    "titleBar.activeForeground": "#9da5b4",
    "titleBar.inactiveBackground": "#282c34",
    "titleBar.inactiveForeground": "#6b717d",
  },
  rules: [
    { foreground: "#676f7d", token: "comment" },
    {
      foreground: "#676f7d",
      token: "string.comment",
    },
    { foreground: "#e5c07b", token: "string" },
    {
      foreground: "#e5c07b",
      token: "string.template",
    },
    { foreground: "#c678dd", token: "constant.numeric" },
    {
      foreground: "#c678dd",
      token: "string.embedded.begin",
    },
    { foreground: "#c678dd", token: "string.embedded.end" },
    {
      foreground: "#c678dd",
      token: "punctuation.definition.template-expression",
    },
    { foreground: "#c678dd", token: "punctuation.section.embedded" },
    {
      foreground: "#abb2bf",
      token: "punctuation.section.embedded.begin.js",
    },
    { foreground: "#abb2bf", token: "punctuation.section.embedded.end.js" },
    {
      foreground: "#abb2bf",
      token: "punctuation.section.embedded.begin.erb",
    },
    { foreground: "#abb2bf", token: "punctuation.section.embedded.end.erb" },
    {
      foreground: "#abb2bf",
      token: "source.elixir.embedded",
    },
    { foreground: "#abb2bf", token: "punctuation.separator" },
    {
      foreground: "#abb2bf",
      token: "punctuation.accessor",
    },
    { foreground: "#abb2bf", token: "meta.brace" },
    {
      foreground: "#56b6c2",
      token: "constant.language",
    },
    { foreground: "#56b6c2", token: "constant.character" },
    {
      foreground: "#56b6c2",
      token: "constant.other",
    },
    { foreground: "#e06c75", token: "variable.language" },
    {
      foreground: "#e06c75",
      token: "keyword",
    },
    { foreground: "#e06c75", token: "keyword.operator.logical" },
    {
      foreground: "#e06c75",
      token: "keyword.operator.constructor",
    },
    { foreground: "#e06c75", token: "keyword.operator" },
    {
      foreground: "#e06c75",
      token: "storage",
    },
    { foreground: "#56b6c2", token: "storage.type" },
    {
      foreground: "#61afef",
      token: "entity.name.class",
    },
    { foreground: "#61afef", token: "entity.name.module" },
    {
      foreground: "#61afef",
      token: "entity.name.type",
    },
    { foreground: "#61afef", token: "storage.identifier" },
    {
      foreground: "#61afef",
      token: "support.class",
    },
    { foreground: "#61afef", token: "variable.other.object" },
    {
      foreground: "#61afef",
      token: "variable.other.constant",
    },
    { foreground: "#61afef", token: "variable.other.global" },
    {
      foreground: "#61afef",
      token: "variable.other.readwrite.class",
    },
    { foreground: "#61afef", token: "variable.other.readwrite.instance" },
    {
      foreground: "#61afef",
      token: "variable.other.readwrite.batchfile",
    },
    { foreground: "#61afef", token: "variable.readwrite" },
    {
      foreground: "#61afef",
      token: "variable.readwrite.other.block",
    },
    { foreground: "#abb2bf", token: "variable.other" },
    {
      foreground: "#abb2bf",
      token: "variable.other.property",
    },
    { foreground: "#abb2bf", token: "variable.other.block" },
    {
      foreground: "#98c379",
      token: "entity.other.inherited-class",
    },
    { foreground: "#61afef", token: "storage.modifier.import" },
    {
      foreground: "#61afef",
      token: "storage.modifier.package",
    },
    { foreground: "#98c379", token: "entity.name.function" },
    {
      foreground: "#98c379",
      token: "support.function",
    },
    {
      fontStyle: "italic",
      foreground: "#d19a66",
      token: "variable.parameter",
    },
    {
      fontStyle: "italic",
      foreground: "#d19a66",
      token: "entity.name.variable.parameter",
    },
    {
      fontStyle: "italic",
      foreground: "#d19a66",
      token: "parameter.variable",
    },
    {
      foreground: "#abb2bf",
      token: "entity.name.function-call",
    },
    { foreground: "#98c379", token: "function.support.builtin" },
    {
      foreground: "#98c379",
      token: "function.support.core",
    },
    { foreground: "#e06c75", token: "entity.name.tag" },
    {
      foreground: "#e06c75",
      token: "entity.name.tag.class.js",
    },
    { foreground: "#56b6c2", token: "entity.name.tag.class" },
    {
      foreground: "#56b6c2",
      token: "entity.name.tag.id",
    },
    { foreground: "#98c379", token: "entity.other.attribute-name" },
    {
      foreground: "#56b6c2",
      token: "support.constant",
    },
    { foreground: "#56b6c2", token: "support.type" },
    {
      foreground: "#56b6c2",
      token: "support.variable",
    },
    { foreground: "#56b6c2", token: "support.dictionary.json" },
    {
      foreground: "#abb2bf",
      token: "support.type.property-name.css",
    },
    { foreground: "#abb2bf", token: "support.type.property-name.scss" },
    {
      foreground: "#abb2bf",
      token: "support.type.property-name.less",
    },
    { foreground: "#abb2bf", token: "support.type.property-name.sass" },
    {
      foreground: "#56b6c2",
      token: "entity.other.attribute-name.pseudo-class.css",
    },
    {
      foreground: "#56b6c2",
      token: "entity.other.attribute-name.pseudo-class.scss",
    },
    {
      foreground: "#56b6c2",
      token: "entity.other.attribute-name.pseudo-class.less",
    },
    {
      foreground: "#56b6c2",
      token: "entity.other.attribute-name.pseudo-class.sass",
    },
    {
      foreground: "#56b6c2",
      token: "entity.other.attribute-name.pseudo-element.css",
    },
    {
      foreground: "#56b6c2",
      token: "entity.other.attribute-name.pseudo-element.scss",
    },
    {
      foreground: "#56b6c2",
      token: "entity.other.attribute-name.pseudo-element.less",
    },
    {
      foreground: "#56b6c2",
      token: "entity.other.attribute-name.pseudo-element.sass",
    },
    {
      foreground: "#98c379",
      token: "support.constant.css",
    },
    { foreground: "#98c379", token: "support.constant.scss" },
    {
      foreground: "#98c379",
      token: "support.constant.less",
    },
    { foreground: "#98c379", token: "support.constant.sass" },
    {
      foreground: "#56b6c2",
      token: "variable.css",
    },
    { foreground: "#56b6c2", token: "variable.scss" },
    {
      foreground: "#56b6c2",
      token: "variable.less",
    },
    { foreground: "#56b6c2", token: "variable.sass" },
    {
      foreground: "#e5c07b",
      token: "variable.css.string",
    },
    { foreground: "#e5c07b", token: "variable.scss.string" },
    {
      foreground: "#e5c07b",
      token: "variable.less.string",
    },
    { foreground: "#e5c07b", token: "variable.sass.string" },
    {
      foreground: "#c678dd",
      token: "unit.css",
    },
    { foreground: "#c678dd", token: "unit.scss" },
    {
      foreground: "#c678dd",
      token: "unit.less",
    },
    { foreground: "#c678dd", token: "unit.sass" },
    {
      foreground: "#56b6c2",
      token: "function.css",
    },
    { foreground: "#56b6c2", token: "function.scss" },
    {
      foreground: "#56b6c2",
      token: "function.less",
    },
    { foreground: "#56b6c2", token: "function.sass" },
    {
      fontStyle: "",
      token: "support.other.variable",
    },
    { background: "#c678dd", foreground: "#f8f8f0", token: "invalid" },
    {
      background: "#56b6c2",
      foreground: "#f8f8f0",
      token: "invalid.deprecated",
    },
    { foreground: "#56b6c2", token: "support.type.property-name.json" },
    {
      foreground: "#61afef",
      token: "string.detected-link",
    },
    { foreground: "#75715e", token: "meta.diff" },
    {
      foreground: "#75715e",
      token: "meta.diff.header",
    },
    { foreground: "#e06c75", token: "markup.deleted" },
    {
      foreground: "#98c379",
      token: "markup.inserted",
    },
    { foreground: "#e5c07b", token: "markup.changed" },
    {
      foreground: "#56b6c2a0",
      token: "constant.numeric.line-number.find-in-files - match",
    },
    { foreground: "#e5c07b", token: "entity.name.filename.find-in-files" },
    {
      fontStyle: "italic",
      token: "markup.italic",
    },
    { fontStyle: "italic", token: " markup.italic.markdown" },
    {
      foreground: "#676f7d",
      token: "punctuation.definition.italic.markdown",
    },
    { foreground: "#676f7d", token: "punctuation.definition.bold.markdown" },
    {
      foreground: "#676f7d",
      token: "punctuation.definition.heading.markdown",
    },
    { fontStyle: "italic", token: "punctuation.definition.italic.markdown" },
    {
      foreground: "#61afef",
      token: "markup.underline.link.markdown",
    },
    { fontStyle: "bold", token: "markup.bold.markdown" },
    {
      fontStyle: "bold",
      foreground: "#e06c75",
      token: "markup.heading.markdown",
    },
    { foreground: "#98c379", token: "markup.quote.markdown" },
    {
      foreground: "#c678dd",
      fontStyle: "bold",
      token: "meta.separator.markdown",
    },
    { foreground: "#56b6c2", token: "markup.raw.inline.markdown" },
    {
      foreground: "#56b6c2",
      token: "markup.raw.block.markdown",
    },
    {
      fontStyle: "bold",
      foreground: "#ffffff",
      token: "punctuation.definition.list_item.markdown",
    },
  ],
  encodedTokensColors: [],
};
