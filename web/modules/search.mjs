"use strict";

import { DIRECTION, PROPS, scope } from "./scope.mjs";
import { DictionarySelector } from "./components.mjs";

const displayResultWord = function (word) {
    if (!word) {
        return "";
    }

    if (parseInt(scope.direction) === DIRECTION.ENG_TO_DWA) {
        for (let entry in DictionarySelector.DWA_TO_ENG) {
            for (let x = 0; x < DictionarySelector.DWA_TO_ENG[entry].length; x++) {
                if (DictionarySelector.DWA_TO_ENG[entry][x] === word.toLowerCase()) {
                    return entry;
                }
            }
        }
    }
};

const findSearchMatches = async function (prop, old_val, new_val) {
    if (new_val.trim() === "") {
        scope.matches = [];
        return;
    }

    let results = [];

    if (parseInt(scope.direction) === DIRECTION.ENG_TO_DWA) {
        for (let entry in DictionarySelector.DWA_TO_ENG) {
            for (let x = 0; x < DictionarySelector.DWA_TO_ENG[entry].length; x++) {
                if (DictionarySelector.DWA_TO_ENG[entry][x].startsWith(new_val.toLowerCase())) {
                    results.push(DictionarySelector.DWA_TO_ENG[entry][x]);
                }
            }
        }
    }

    scope.matches = results;
};

export { displayResultWord, findSearchMatches };
