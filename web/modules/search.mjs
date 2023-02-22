"use strict";

import { DIRECTION, scope } from "./scope.mjs";
import { DictionarySelector } from "./components.mjs";

const ResultWord = (entry, translation) => {
    return {
        entry,
        translation,
    };
};

/**
 * @param word {string}
 * @returns {{entry, translation}}
 */
const displayResultWord = function (word) {
    if (!word) {
        return undefined;
    }

    word = word.toLowerCase();

    if (scope.direction === DIRECTION.ENG_TO_DWA) {
        for (let entry in DictionarySelector.DWA_TO_ENG) {
            for (let x = 0; x < DictionarySelector.DWA_TO_ENG[entry].length; x++) {
                if (DictionarySelector.DWA_TO_ENG[entry][x] === word) {
                    return ResultWord(entry, DictionarySelector.DWA_TO_ENG[entry].join(", "));
                }
            }
        }
    } else if (scope.direction === DIRECTION.DWA_TO_ENG) {
        for (let entry in DictionarySelector.DWA_TO_ENG) {
            if (entry.toLowerCase().startsWith(word)) {
                return ResultWord(entry, DictionarySelector.DWA_TO_ENG[entry].join(", "));
            }
        }
    }
};

/**
 * @param prop {string}
 * @param old_val {any}
 * @param new_val {any}
 */
const findSearchMatches = function (prop, old_val, new_val) {
    if (!new_val.trim()) {
        scope.matches = [];
        return;
    }

    let results = [];
    new_val = new_val.toLowerCase();

    if (scope.direction === DIRECTION.ENG_TO_DWA) {
        for (let entry in DictionarySelector.DWA_TO_ENG) {
            for (let x = 0; x < DictionarySelector.DWA_TO_ENG[entry].length; x++) {
                if (DictionarySelector.DWA_TO_ENG[entry][x].startsWith(new_val)) {
                    results.push(DictionarySelector.DWA_TO_ENG[entry][x]);
                }
            }
        }
    } else if (scope.direction === DIRECTION.DWA_TO_ENG) {
        for (let entry in DictionarySelector.DWA_TO_ENG) {
            if (entry.toLowerCase().startsWith(new_val)) {
                results.push(entry);
            }
        }
    }

    scope.matches = results;
};

export { displayResultWord, findSearchMatches };
