import { searchDictionary } from "./search.mjs";
import { PROPS, scope } from "./scope.mjs";

// Preview box with the dynamic list of matches. This is updated as the user changes the word search
class SearchMatchesList extends HTMLElement {
    constructor() {
        super();
    }

    updateSearchMatchesList = (prop, old_val, new_val) => {
        if (prop === PROPS.MATCHES) {
            console.log(new_val);
        }
    };

    connectedCallback() {
        scope.subscribe(this.updateSearchMatchesList);
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
        if (!value.trim().length) {
            return;
        }

        scope.word = value;
        void searchDictionary();
    }

    connectedCallback() {
        if (this.value) {
            scope.word = this.value;
        }

        this.addEventListener("input", (e) => this.onInput(e.target.value));
    }

    disconnectedCallback() {
        this.removeEventListener("input", this.onInput);
    }
}

// Dropdown to select the dictionary to search, expressed in terms of direction between languages (left -> right)
class LanguageSelector extends HTMLSelectElement {
    constructor() {
        super();
    }

    onChange(value) {
        scope.direction = parseInt(value);
    }

    connectedCallback() {
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
        if (!scope.word) {
            return;
        }

        void searchDictionary();
    }

    connectedCallback() {
        this.addEventListener("click", (e) => this.onClick(e.target.value));
    }

    disconnectedCallback() {
        this.removeEventListener("click", this.onClick);
    }
}

export { LanguageSelector, SearchButton, SearchMatchesList, WordInput };
