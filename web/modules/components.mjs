"use strict";

import { displayResultWord, findSearchMatches } from "./search.mjs";
import { DIRECTION, PROPS, scope } from "./scope.mjs";

class DwarvenGrammar extends HTMLElement {
    template;
    shadowRoot;

    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: "open" });
        this.template = document.getElementById("dwarven-grammar").content;

        this.shadowRoot.appendChild(this.template.cloneNode(true));
    }
}

class GrammarNavigation extends HTMLElement {
    template;
    shadowRoot;

    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: "open" });
        this.template = document.getElementById("grammar-navigation").content;

        const clone = this.template.cloneNode(true);
        const h2 = clone.querySelector("h2");
        h2.innerText = "Table of Contents";
        this.shadowRoot.appendChild(h2);
        this.shadowRoot.appendChild(clone);
    }
}

class DwarvenTranslator extends HTMLElement {
    template;
    shadowRoot;

    constructor() {
        super();
        this.template = document.getElementById("dwarven-translator").content;
        this.shadowRoot = this.attachShadow({ mode: "open" });

        const clone = this.template.cloneNode(true);
        const word_search = document.createElement("word-search");
        const h2 = clone.querySelector("h2");
        h2.innerText = "Translator";
        this.shadowRoot.appendChild(h2);
        this.shadowRoot.appendChild(word_search);
    }

    // Once the user selects a valid word to search, create and append the element to show the search result word and its
    // details
    displaySearchResult() {
        const search_result = document.createElement("search-result");
        search_result.setAttribute(PROPS.WORD, scope.word);

        if (this.shadowRoot.querySelector("search-result")) {
            this.shadowRoot.querySelector("search-result").remove(); // clear any previous result
        }

        this.shadowRoot.appendChild(search_result);
    }

    disconnectedCallback() {
        this.shadowRoot.replaceChildren();
    }
}

class WordSearch extends HTMLElement {
    shadowRoot;

    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(document.createElement("dictionary-selector"));
        this.shadowRoot.appendChild(document.createElement("br"));
        this.shadowRoot.appendChild(document.createElement("word-input"));
        this.shadowRoot.appendChild(document.createElement("search-matches-list"));
    }
}

// Input for the word to search in the chosen dictionary
class WordInput extends HTMLElement {
    name = "word-input-elem";
    input;
    shadowRoot;

    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: "open" });

        this.input = document.createElement("input");
        this.input.setAttribute("id", this.name);
        this.shadowRoot.appendChild(this.input);
    }

    get value() {
        return this.input.value;
    }

    set value(value) {
        this.input.value = value;
    }

    onInput = (value) => {
        scope.search = value;
        this.value = scope.search;
    };

    displayWord = (prop, old_val, new_val) => {
        this.value = new_val;
    };

    connectedCallback() {
        if (this.value) {
            scope.search = this.value;
        }

        scope.subscribe(PROPS.SEARCH, findSearchMatches);
        scope.subscribe(PROPS.WORD, this.displayWord);
        this.shadowRoot.querySelector("input").addEventListener("input", (e) => this.onInput(e.target.value));
    }

    disconnectedCallback() {
        scope.unsubscribe(findSearchMatches);
        scope.unsubscribe(this.displayWord);
        this.removeEventListener("input", this.onInput);
    }
}

// Main area where details about the searched word are displayed
class SearchResult extends HTMLElement {
    template;
    shadowRoot;

    constructor() {
        super();
        this.template = document.getElementById("search-result").content;
        this.shadowRoot = this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return [PROPS.WORD];
    }

    attributeChangedCallback(name, old_value, new_value) {
        const result = displayResultWord(new_value);
        const clone = this.template.cloneNode(true);
        const h3 = clone.querySelector("h3");
        h3.textContent = result[0];
        const div = clone.querySelector("div");
        div.textContent = result[1];

        this.shadowRoot.append(clone);
    }
}

// Dropdown to select the dictionary to search, expressed in terms of direction between languages (left -> right)
class DictionarySelector extends HTMLElement {
    // The list of all known words in DWA that have translations in ENG. At the moment the translated words in ENG
    // do not have further details for richer contexts (e.g. multiple meaning, synonyms, etc..) just a simple indication
    // whether the word is a noun (n.) or a verb (v.)
    static DWA_TO_ENG;
    static DWA;
    name = "dictionary-select-elem";
    select;
    shadowRoot;

    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: "open" });

        this.select = document.createElement("select");
        this.select.setAttribute("id", this.name);
        const option = document.createElement("option");
        option.value = "0";
        option.innerText = "English → Dwarven";
        this.select.append(option);
        this.shadowRoot.appendChild(this.select);
    }

    get value() {
        return this.select.value;
    }

    set value(value) {
        this.select.value = value;
    }

    onChange = (value) => {
        scope.direction = parseInt(value);
    };

    async connectedCallback() {
        if (parseInt(scope.direction) === DIRECTION.ENG_TO_DWA) {
            if (!DictionarySelector.DWA_TO_ENG) {
                const res = await fetch(new Request(DWA_TO_ENG_URI));
                DictionarySelector.DWA_TO_ENG = await res.json();
            }
            if (!DictionarySelector.DWA) {
                const res = await fetch(new Request(DWA_URI));
                DictionarySelector.DWA = await res.json();
            }
        }

        this.shadowRoot.querySelector("select").addEventListener("input", (e) => this.onChange(e.target.value));
    }

    disconnectedCallback() {
        this.removeEventListener("change", this.onChange);
    }
}

// Preview box with the dynamic list of matches. This is updated as the user changes the word search
class SearchMatchesList extends HTMLElement {
    template;
    shadowRoot;
    static MAX_MATCHES_IN_PREVIEW = 10;

    constructor() {
        super();
        this.template = document.getElementById("search-matches-item").content;
        this.shadowRoot = this.attachShadow({ mode: "open" });
    }

    selectWordFromMatches(value) {
        scope.word = scope.search = value;
        scope.matches = [];
        const dwarven_translator = document.querySelector("dwarven-translator");
        dwarven_translator.displaySearchResult();
    }

    updateSearchMatchesList = (prop, old_val, new_val) => {
        let new_matches = [];

        for (let i = 0; i < new_val.length; i++) {
            if (i === SearchMatchesList.MAX_MATCHES_IN_PREVIEW) {
                break;
            }

            const clone = this.template.firstElementChild.cloneNode(true);
            const a = clone.querySelector("a");
            a.textContent = new_val[i];
            a.href = "javascript:void(0)";
            a.setAttribute("data-word", new_val[i]);
            a.title = "Search '" + new_val[i] + "'";
            a.addEventListener(
                "click",
                (e) => this.selectWordFromMatches(e.target.getAttribute("data-word")),
            );
            new_matches.push(clone);
        }

        if (new_matches.length === 0) {
            this.shadowRoot.replaceChildren();
        } else {
            this.shadowRoot.replaceChildren(...new_matches);
        }
    };

    connectedCallback() {
        scope.subscribe(PROPS.MATCHES, this.updateSearchMatchesList);
    }

    disconnectedCallback() {
        scope.unsubscribe(this.updateSearchMatchesList);
    }
}

export {
    DictionarySelector,
    DwarvenGrammar,
    DwarvenTranslator,
    GrammarNavigation,
    SearchMatchesList,
    SearchResult,
    WordInput,
    WordSearch,
};
