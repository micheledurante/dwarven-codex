<!DOCTYPE html>
<!--
    hi there! 🤝
    md https://github.com/micheledurante/dwarven-codex
    Version #VERSION# built with #ARCH# on #DATE#
-->
<html lang="en">

<head>
    <meta charset="utf-8"/>
    <title>The Dwarven Codex</title>

    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <link rel="icon" href="favicon.ico" type="image/x-icon" />

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
    <header>
        <h1>The Dwarven Codex</h1>
    </header>
    <article>
        <div id="dwarven-dictionary">
            <header>
                <div>
                    <label for="word-input">Word Search</label>
                    <input is="word-input" id="word-input" required/>
                    <search-matches-list>
                        <ul slot="search-matches-list"></ul>
                    </search-matches-list>
                </div>
                <div>
                    <label for="dictionary-selector">Dictionary</label>
                    <select is="dictionary-selector" id="dictionary-selector" required>
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

<template id="search-matches-item">
    <li></li>
</template>

</html>
