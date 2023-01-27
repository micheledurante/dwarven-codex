import { DIRECTION, scope } from "./scope.mjs";

// The list of all known words in DWA that have translations in ENG. At the moment the translated words in ENG
// do not have further details for richer contexts (e.g. multiple meaning, synonyms, etc..) just a simple indication
// whether the word is a noun (n.) or a verb (v.)
let DWA_TO_ENG;

function searchEngToDwa(word) {
    let results = [];

    for (let entry in DWA_TO_ENG) {
        for (let x = 0; x < DWA_TO_ENG[entry].length; x++) {
            if (DWA_TO_ENG[entry][x].includes(word)) {
                results.push(entry);
            }
        }
    }

    return results;
}

const searchDictionary = async function () {
    if (!DWA_TO_ENG) {
        const res = await fetch(new Request(DWA_TO_ENG_URL));
        DWA_TO_ENG = await res.json();
    }

    if (parseInt(scope.direction) === DIRECTION.ENG_TO_DWA) {
        scope.matches = searchEngToDwa(scope.word);
    }
};

export { searchDictionary };
