import { scope } from "./main.mjs";

export const DIRECTION = {
    ENG_TO_DWA: 0,
    DWA_TO_ENG: 1,
};

function searchEngToDwa(word) {
    scope.matches = [];
    console.log(`DEBUG --- searchEngToDwa ${word}`);
    for (let entry in scope.dwaToEng) {
        for (let x = 0; x < scope.dwaToEng[entry].length; x++) {
            if (scope.dwaToEng[entry][x].includes(word)) {
                scope.matches.push(entry);
            }
        }
    }

    console.log(scope.matches);
}

const searchDictionary = async function () {
    if (!scope.dwaToEng) {
        const res = await fetch(new Request(DWA_TO_ENG_URL));
        scope.dwaToEng = await res.json();
    }

    console.log("DEBUG --- searchDictionary");
    if (scope.direction === DIRECTION.ENG_TO_DWA) {
        return searchEngToDwa(scope.word);
    }
};

export { searchDictionary };
