# Dwarven Codex

Written in vanilla JS with ES modules, Web Components and ES2015 features.

To build the application, Deno and TS are used.

## Install

Before running the application, language files and other steps must be performed with:

1. Install [Deno](https://deno.land/)
2. `deno run --allow-read --allow-write --allow-sys .\bin\install.ts`

You can now run `web/index.html` with a modern browser: there is no support for anything older than ES2015.

### Installation Process in Details

ES2015 modules are used to import `.mjs` files. The entry point is the file `web/modules/main.mjs`.

`web/modules/main.js` for registering web components in the DOM.

The file `bin/index.html.tpl` is used to bootstrap the JS web components: it contains a mix of HTML, CSS and the JS
script tag used as entry point.

To run correctly, it needs to be processed by `bin/install.ts` script. The script will generate its content and create
the file in the correct location to be served to web clients.

## Deploy

After building, point the web server to `web/` and serve `index.html`.

## Development

1. Edit `.js` files as needed.
2. `deno run --allow-read --allow-write --allow-sys .\bin\install.ts`
3. `deno fmt`
4. Reload `web/index.html`
