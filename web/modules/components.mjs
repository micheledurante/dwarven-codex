import { searchDictionary } from "./search.mjs";
import { scope } from "./main.mjs";

class WordInput extends HTMLInputElement {
    constructor() {
        super();
    }

    onInput(value) {
        scope.word = value;
        void searchDictionary();
    }

    connectedCallback() {
        console.log("DEBUG --- WordInput connectedCallback");

        if (this.value !== undefined) {
            scope.word = this.value;
        }

        this.addEventListener("input", (e) => this.onInput(e.target.value));
    }

    disconnectedCallback() {
        this.removeEventListener("input", this.onInput);
    }
}

class LanguageSelector extends HTMLSelectElement {
    constructor() {
        super();
    }

    onChange(value) {
        scope.direction = value;
    }

    connectedCallback() {
        console.log("DEBUG --- LanguageSelector connectedCallback");
        this.addEventListener("input", (e) => this.onChange(e.target.value));
    }

    disconnectedCallback() {
        this.removeEventListener("change", this.onChange);
    }
}

class SearchButton extends HTMLButtonElement {
    constructor() {
        super();
    }

    onClick() {
        void searchDictionary();
    }

    connectedCallback() {
        console.log("DEBUG --- SearchButton connectedCallback");
        this.addEventListener("click", (e) => this.onClick(e.target.value));
    }

    disconnectedCallback() {
        this.removeEventListener("click", this.onClick);
    }
}

export { LanguageSelector, SearchButton, WordInput };
