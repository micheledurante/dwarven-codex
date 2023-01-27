import { DictionarySelector, SearchButton, SearchMatchesList, WordInput } from "./components.mjs";

// register components
customElements.define("search-matches-list", SearchMatchesList);
customElements.define("word-input", WordInput, { extends: "input" });
customElements.define("dictionary-selector", DictionarySelector, { extends: "select" });
customElements.define("search-button", SearchButton, { extends: "button" });
