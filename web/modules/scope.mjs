"use strict";

// Values assigned to the direction for dictionary searches
export const DIRECTION = {
    ENG_TO_DWA: 0,
    DWA_TO_ENG: 1,
};

// Convenience const for working with the scope's properties names
export const PROPS = {
    WORD: "word",
    SEARCH: "search",
    MATCHES: "matches",
    DIRECTION: "direction",
};

// Observable, mutable state across components
export const scope = {
    // List of registered callbacks that will be notified upon changes.
    _listeners: {},

    // Internal object to hold values accessed by getters and setters
    _value: {
        word: undefined,
        search: undefined,
        matches: [],
        direction: DIRECTION.ENG_TO_DWA,
    },

    notify(prop, old_val, new_val) {
        if (!this._listeners[prop]) {
            this._listeners[prop] = [];
        }

        this._listeners[prop].forEach((listener) => listener(prop, old_val, new_val));
    },

    subscribe(prop, listener) {
        if (!this._listeners[prop]) {
            this._listeners[prop] = []; // init listeners collection
        }

        this._listeners[prop].push(listener);
    },

    unsubscribe(listener) {
    },

    // word

    /**
     * The searched word. The search is performed in the selected `direction`, the only valid matches when searching
     * ENG -> DWA for instance are valid english words
     *
     * @returns {string}
     */
    get word() {
        return this._value.word;
    },

    set word(new_val) {
        if (new_val !== this._value.word) {
            const old_val = this._value.word;
            this._value.word = new_val;
            this.notify(PROPS.WORD, old_val, new_val);
        }
    },

    // search

    /**
     * The temporary search as the uer types before either clicking `search` or one of the preview results
     *
     * @returns {string}
     */
    get search() {
        return this._value.search;
    },

    set search(new_val) {
        if (new_val !== this._value.search) {
            const old_val = this._value.search;
            this._value.search = new_val;
            this.notify(PROPS.SEARCH, old_val, new_val);
        }
    },

    // matches

    /**
     * The results displayed from the search for the given word as the user types in the word input
     *
     * @returns {string[]}
     */
    get matches() {
        return this._value.matches;
    },

    set matches(new_val) {
        if (new_val !== this._value.matches) {
            const old_val = this._value.matches;
            this._value.matches = new_val;
            this.notify(PROPS.MATCHES, old_val, new_val);
        }
    },

    // direction

    /**
     * The match will be done from a valid word in the first (left) language to whatever matches it starting from the
     * beginning of each word in the second (right) language
     *
     * @returns {number}
     */
    get direction() {
        return this._value.direction;
    },

    set direction(new_val) {
        if (new_val !== this._value.direction) {
            const old_val = this._value.direction;
            this._value.direction = parseInt(new_val);
            this.notify(PROPS.DIRECTION, old_val, new_val);
        }
    },
};
