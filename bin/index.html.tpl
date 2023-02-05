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
        html {
            margin: 0;
        }

        body {
            width: 100%;
            max-width: 960px;
            line-height: 2rem;
            margin: 0 auto;
            font-family: monospace;
            font-size: 1.2rem;
        }

        a,
        select,
        button {
            cursor: pointer;
        }
    </style>

    <script>
        const DWA_TO_ENG_URI = "json/dwa-to-eng.#DWA_TO_ENG_DICT_HASH#.json";
        const DWA_URI = "json/dwa.#DWA_DICT_HASH#.json";
    </script>

    <script type="module" src="modules/main.mjs"
            integrity="#MODULE_ALGO#-#MODULE_HASH#"
            crossorigin="anonymous"
            defer>
    </script>
</head>

<body>
<main>
    <header>
        <h1>The Dwarven Codex</h1>
    </header>
    <article>
        <dwarven-dictionary></dwarven-dictionary>
    </article>
</main>
</body>

<template id="search-matches-item">
    <li>
        <a></a>
    </li>
</template>

<template id="search-result" word="">
    <h3></h3>
    <div></div>
</template>

<template id="search-matches-list">
    <ul></ul>
</template>

</html>