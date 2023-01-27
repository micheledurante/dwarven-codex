<!DOCTYPE html>
<!--
    hi there! 🤝
    md https://github.com/micheledurante/dwarven-codex
    Version #VERSION# built with #ARCH# on #DATE#
-->
<html lang="en">

<head>
    <meta charset="utf-8"/>
    <title>Dwarven Codex</title>

    <style>
        label {
            display: block;
        }

        select,
        button {
            cursor: pointer;
        }
    </style>

    <script>const DWA_TO_ENG_URL = "json/dwa-to-eng.#DICT_HASH#.json";</script>

    <script type="module" src="modules/main.mjs"
            integrity="#MODULE_ALGO#-#MODULE_HASH#"
            crossorigin="anonymous">
    </script>
</head>

<body>
<main>
    <article>
        <div id="dwarven-dictionary">
            <header>
                <div>
                    <label for="word-input">Word Search</label>
                    <input is="word-input" id="word-input" required/>
                </div>
                <div>
                    <label for="language-selector">Language</label>
                    <select is="language-selector" id="language-selector" required>
                        <option value="0" selected>English -> Dwarven</option>
                    </select>
                </div>
                <div>
                    <button is="search-button" type="submit">Search</button>
                </div>
            </header>
        </div>
    </article>
</main>
</body>

</html>
