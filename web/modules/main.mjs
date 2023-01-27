import { LanguageSelector, SearchButton, SearchMatchesList, WordInput } from "./components.mjs";

// register components
customElements.define("search-matches-list", SearchMatchesList);
customElements.define("word-input", WordInput, { extends: "input" });
customElements.define("language-selector", LanguageSelector, { extends: "select" });
customElements.define("search-button", SearchButton, { extends: "button" });
