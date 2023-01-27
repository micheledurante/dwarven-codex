import { DIRECTION } from "./search.mjs";
import { LanguageSelector, SearchButton, WordInput } from "./components.mjs";

export let scope = {
    word: undefined,
    matches: [],
    direction: DIRECTION.ENG_TO_DWA,
    dwaToEng: undefined,
};

const init = () => {
    // register components
    customElements.define("word-input", WordInput, { extends: "input" });
    customElements.define("language-selector", LanguageSelector, { extends: "select" });
    customElements.define("search-button", SearchButton, { extends: "button" });
};

init();
