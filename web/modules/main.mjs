"use strict";

import {
    DictionarySelector,
    DwarvenDictionary,
    SearchButton,
    SearchMatchesList,
    SearchResult,
    WordInput,
    WordSearch,
} from "./components.mjs";

// register components
customElements.define("search-button", SearchButton);
customElements.define("search-result", SearchResult);
customElements.define("dictionary-selector", DictionarySelector);
customElements.define("word-input", WordInput);
customElements.define("word-search", WordSearch);
customElements.define("dwarven-dictionary", DwarvenDictionary);
customElements.define("search-matches-list", SearchMatchesList);
