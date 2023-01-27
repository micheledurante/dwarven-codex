import { DIRECTION } from "./search.mjs";
import { LanguageSelector, SearchButton, WordInput } from "./components.mjs";

// shared, mutable state across components
export let scope = {
    // the searched word. The search is performed in the selected `direction`, the only valid matches when searching
    // ENG -> DWA for instance are valid english words
    word: undefined,
    // the results displayed from the search
    matches: [],
    // the match will be done from a valid word in the first (left) language to whatever matches it starting from the
    // beginning of each word in the second (right) language
    direction: DIRECTION.ENG_TO_DWA,
    // the list of all known words in DWA that have translations in ENG. At the moment the translated words in ENG
    // do not have further details for richer contexts (e.g. multiple meaning, synonyms, etc..) just a simple indication
    // whether the word is a noun (n.) or a verb (v.)
    dwaToEng: undefined,
};

const init = () => {
    // register components
    customElements.define("word-input", WordInput, { extends: "input" });
    customElements.define("language-selector", LanguageSelector, { extends: "select" });
    customElements.define("search-button", SearchButton, { extends: "button" });
};

init();
