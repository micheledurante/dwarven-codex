import { findSearchMatches } from "./search.mjs";
import { DIRECTION, PROPS, scope } from "./scope.mjs";

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

    updateSearchMatchesList = (prop, old_val, new_val) => {
        let new_matches = [];

        for (let i = 0; i < new_val.length; i++) {
            if (i === SearchMatchesList.MAX_MATCHES_IN_PREVIEW) {
                break;
            }

            const clone = this.template.firstElementChild.cloneNode(true);
            clone.textContent = new_val[i];
            new_matches.push(clone);
        }

        this.shadowRoot.replaceChildren(...new_matches);
    };

    connectedCallback() {
        scope.subscribe(PROPS.MATCHES, this.updateSearchMatchesList);
    }

    disconnectedCallback() {
        scope.unsubscribe(this.updateSearchMatchesList);
    }
}

// Input for the word to search in the chosen dictionary
class WordInput extends HTMLInputElement {
    constructor() {
        super();
    }

    onInput(value) {
        scope.word = value;
    }

    connectedCallback() {
        if (this.value) {
            scope.word = this.value;
        }

        scope.subscribe(PROPS.WORD, findSearchMatches);
        this.addEventListener("input", (e) => this.onInput(e.target.value));
    }

    disconnectedCallback() {
        scope.unsubscribe(findSearchMatches);
        this.removeEventListener("input", this.onInput);
    }
}

// Dropdown to select the dictionary to search, expressed in terms of direction between languages (left -> right)
class DictionarySelector extends HTMLSelectElement {
    // The list of all known words in DWA that have translations in ENG. At the moment the translated words in ENG
    // do not have further details for richer contexts (e.g. multiple meaning, synonyms, etc..) just a simple indication
    // whether the word is a noun (n.) or a verb (v.)
    static DWA_TO_ENG;

    constructor() {
        super();
    }

    onChange(value) {
        scope.direction = parseInt(value);
    }

    async connectedCallback() {
        if (parseInt(scope.direction) === DIRECTION.ENG_TO_DWA) {
            if (!DictionarySelector.DWA_TO_ENG) {
                const res = await fetch(new Request(DWA_TO_ENG_URI));
                DictionarySelector.DWA_TO_ENG = await res.json();
            }
        }

        this.addEventListener("input", (e) => this.onChange(e.target.value));
    }

    disconnectedCallback() {
        this.removeEventListener("change", this.onChange);
    }
}

// Button to perform the search on the given word and in the given direction. Populates the detailed view of the results
class SearchButton extends HTMLButtonElement {
    constructor() {
        super();
    }

    onClick() {
    }

    connectedCallback() {
        this.addEventListener("click", (e) => this.onClick(e.target.value));
    }

    disconnectedCallback() {
        this.removeEventListener("click", this.onClick);
    }
}

export { DictionarySelector, SearchButton, SearchMatchesList, WordInput };
