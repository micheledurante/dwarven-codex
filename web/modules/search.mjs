import { DIRECTION, scope } from "./scope.mjs";
import { DictionarySelector } from "./components.mjs";

function searchEngToDwa(word) {
    if (!word) {
        return [];
    }

    let results = [];

    for (let entry in DictionarySelector.DWA_TO_ENG) {
        for (let x = 0; x < DictionarySelector.DWA_TO_ENG[entry].length; x++) {
            if (DictionarySelector.DWA_TO_ENG[entry][x].startsWith(word.toLowerCase())) {
                results.push(DictionarySelector.DWA_TO_ENG[entry][x]);
            }
        }
    }

    return results;
}

const findSearchMatches = async function (prop, old_val, new_val) {
    if (parseInt(scope.direction) === DIRECTION.ENG_TO_DWA) {
        scope.matches = searchEngToDwa(new_val);
    }
};

export { findSearchMatches };
