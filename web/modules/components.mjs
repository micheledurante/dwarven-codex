"use strict";

import { displayResultWord, findSearchMatches } from "./search.mjs";
import { DIRECTION, PROPS, scope } from "./scope.mjs";
import { base_style } from "./main.mjs";

// Provides style and shadow root for each component
class BaseHTMLElement extends HTMLElement {
    template;
    shadowRoot;
    style;

    constructor() {
        super();

        // We always have a shadow root
        this.shadowRoot = this.attachShadow({ mode: "open" });

        // Create and attach base style to any shadow root
        this.style = document.createElement("style");
        this.style.textContent = base_style;
        this.shadowRoot.appendChild(this.style); // Any additional style can be appended to style.textContent

        // for HTML template the implementation is left to each component
    }
}

// The link to scroll back to the top of the page from further down the document
class ScrollToTop extends BaseHTMLElement {
    constructor() {
        super();
        this.template = document.getElementById("scroll-to-top").content;

        this.style.textContent += `
            #scroll-to-top__content {
                position: fixed;
                bottom: 0;
                text-align: right;
                left: 0;
                right: 0;
                line-height: 32px;
                max-width: 960px;
                width: 100%;
                margin: 0 auto;
            }
        `;

        const clone = this.template.cloneNode(true);
        this.shadowRoot.appendChild(clone.getElementById("scroll-to-top__content"));
    }

    scrollToTop(e) {
        e.preventDefault();
        document.getElementById("top").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    connectedCallback() {
        this.shadowRoot.getElementById("scroll-to-top__link").addEventListener(
            "click",
            (e) => this.scrollToTop(e),
        );
    }

    disconnectedCallback() {
        this.shadowRoot.getElementById("scroll-to-top__link").removeEventListener("click", this.scrollToTop);
    }
}

class DwarvenGrammar extends BaseHTMLElement {
    HEADER_H1_HEIGHT = 66;

    constructor() {
        super();
        this.template = document.getElementById("dwarven-grammar").content;

        this.style.textContent += `
            table {
                width: 100%;
            }
            
            code {
                background-color: rgb(221 255 221);
                padding: 1px 4px;
                border-radius: 2px;
            }
            
            pre code {
                background-color: rgb(160 255 160);
                padding: 6px;
                border-radius: 4px;
                display: block;
            }
        `;

        this.shadowRoot.appendChild(this.template.cloneNode(true));
    }

    showScrollToTop() {
        const topOffset = window.pageYOffset || document.documentElement.scrollTop;

        if (topOffset >= this.HEADER_H1_HEIGHT && !this.shadowRoot.querySelector("scroll-to-top")) {
            this.shadowRoot.appendChild(document.createElement("scroll-to-top"));
        }

        if (topOffset < this.HEADER_H1_HEIGHT && this.shadowRoot.querySelector("scroll-to-top")) {
            this.shadowRoot.querySelector("scroll-to-top").remove();
        }
    }

    connectedCallback() {
        document.addEventListener("scroll", (_e) => this.showScrollToTop());
    }

    disconnectedCallback() {
        document.removeEventListener("scroll", this.showScrollToTop);
    }
}

class GrammarNavigation extends BaseHTMLElement {
    constructor() {
        super();
        this.template = document.getElementById("grammar-navigation").content;

        this.shadowRoot.appendChild(this.style);
        const clone = this.template.cloneNode(true);
        const h2 = clone.querySelector("h2");
        h2.innerText = "Table of Contents";
        this.shadowRoot.appendChild(h2);
        this.shadowRoot.appendChild(clone);
    }

    scrollToId(id) {
        document.getElementsByTagName("dwarven-grammar")[0]
            .shadowRoot
            .getElementById(id.replace("#", ""))
            .scrollIntoView({ behavior: "smooth", block: "start" });
    }

    connectedCallback() {
        for (let a of this.shadowRoot.querySelectorAll("a")) {
            a.addEventListener(
                "click",
                (e) => this.scrollToId(e.target.getAttribute("href")),
            );
        }
    }

    disconnectedCallback() {
        for (let a of this.shadowRoot.querySelectorAll("a")) {
            a.removeEventListener("click", this.scrollToId);
        }
    }
}

class DwarvenTranslator extends BaseHTMLElement {
    constructor() {
        super();
        this.template = document.getElementById("dwarven-translator").content;

        this.shadowRoot.appendChild(this.style);
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

class WordSearch extends BaseHTMLElement {
    constructor() {
        super();

        this.shadowRoot.appendChild(this.style);
        this.shadowRoot.appendChild(document.createElement("dictionary-selector"));
        this.shadowRoot.appendChild(document.createElement("br"));
        this.shadowRoot.appendChild(document.createElement("word-input"));
        this.shadowRoot.appendChild(document.createElement("search-matches-list"));
    }
}

// Input for the word to search in the chosen dictionary
class WordInput extends BaseHTMLElement {
    name = "word-input-elem";
    input;

    constructor() {
        super();

        this.style.textContent += `
            input {
                margin: 2px 0 0;
            }
        `;

        this.shadowRoot.appendChild(this.style);
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
class SearchResult extends BaseHTMLElement {
    constructor() {
        super();
        this.template = document.getElementById("search-result").content;

        this.style.textContent += `
            h3 {
                margin: 0 0 1rem;
            }
        
            #search-result__wrapper {
                background-color: rgb(160 255 160);
                display: block;
                border-radius: 4px;
                padding: 6px 10px;
                margin: 1rem 0 0 0;
            }
        `;
    }

    static get observedAttributes() {
        return [PROPS.WORD];
    }

    attributeChangedCallback(name, old_value, new_value) {
        const result = displayResultWord(new_value);
        const clone = this.template.cloneNode(true);
        const h3 = clone.getElementById("search-result__heading");
        h3.textContent = result[0];
        const div = clone.getElementById("search-result__content");
        div.textContent = result[1];

        this.shadowRoot.append(clone);
    }
}

// Dropdown to select the dictionary to search, expressed in terms of direction between languages (left -> right)
class DictionarySelector extends BaseHTMLElement {
    // The list of all known words in DWA that have translations in ENG. At the moment the translated words in ENG
    // do not have further details for richer contexts (e.g. multiple meaning, synonyms, etc..) just a simple indication
    // whether the word is a noun (n.) or a verb (v.)
    static DWA_TO_ENG;
    static DWA;
    name = "dictionary-select-elem";
    select;

    constructor() {
        super();

        this.shadowRoot.appendChild(this.style);
        this.select = document.createElement("select");
        this.select.setAttribute("id", this.name);
        const option = document.createElement("option");
        option.value = "0";
        option.innerText = "English 🠆 Dwarven"; // &#129030;
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
class SearchMatchesList extends BaseHTMLElement {
    static MAX_MATCHES_IN_PREVIEW = 10;

    constructor() {
        super();
        this.template = document.getElementById("search-matches-item").content;

        const clone = this.template.cloneNode(true);
        this.shadowRoot.appendChild(clone.getElementById("search-matches-item__list"));
        this.shadowRoot.getElementById("search-matches-item__list").replaceChildren();
    }

    selectWordFromMatches(e) {
        e.preventDefault();
        scope.word = scope.search = e.target.getAttribute("data-word");
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

            const clone = this.template.cloneNode(true).getElementById("search-matches-item__item");
            const a = clone.querySelector("a");
            a.textContent = new_val[i];
            a.href = "javascript:void(0)";
            a.setAttribute("data-word", new_val[i]);
            a.title = `Search "${new_val[i]}"`;
            a.addEventListener("click", (e) => this.selectWordFromMatches(e));
            new_matches.push(clone);
        }

        if (new_matches.length === 0) {
            this.shadowRoot.getElementById("search-matches-item__list").replaceChildren();
        } else {
            this.shadowRoot.getElementById("search-matches-item__list").replaceChildren(...new_matches);
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
    ScrollToTop,
    SearchMatchesList,
    SearchResult,
    WordInput,
    WordSearch,
};
