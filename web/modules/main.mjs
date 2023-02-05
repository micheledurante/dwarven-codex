"use strict";

import {
    DictionarySelector,
    DwarvenTranslator,
    SearchMatchesList,
    SearchResult,
    WordInput,
    WordSearch,
} from "./components.mjs";

// register components
customElements.define("search-result", SearchResult);
customElements.define("dictionary-selector", DictionarySelector);
customElements.define("word-input", WordInput);
customElements.define("word-search", WordSearch);
customElements.define("dwarven-translator", DwarvenTranslator);
customElements.define("search-matches-list", SearchMatchesList);
