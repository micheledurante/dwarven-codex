## JS source -> custom script -> Browser

ES6 JS modules can be modified and run directly (save + reload). Some pre-processing is done on `index.html` to replace
some strings.

Pros:

- No build required and highest maintainability.
- Write and run the exact same ES6 native code.
- 0 dependencies to deploy.
- No dev watch or similar, debug in the browser "as is".

Cons:

- ES modules require many HTTP requests to be loaded individually.
- ES modules cannot be loaded lazily. Either all at once or nothing.
- Manually run command to regenerate index.html. The actual HTML lives in a template file that must be edited
  separately.
- No JSON file imports.
- Need external tool for testing.
- No linter or formatter.

## JS source -> Deno build -> Deno bundler -> Browser

JS source code must be processed before running and imported as module in `index.html` which needs processing too. Needs
a dev server with watch.

Pros:

- Sane remote modules import via URL https://deno.land/manual@v1.30.2/basics/modules#concepts (no dep management)
- Formatter, linter, testing by default.
- Better ES6 modules with `import assertions` https://tc39.es/proposal-import-assertions/ for JSON.
- Deno tasks can bundle custom build steps required https://deno.land/manual@v1.30.2/tools/task_runner.

Cons:

- Designed for server-side execution, Deno bundler is not recommended for Browsers
  https://deno.land/manual@v1.30.2/tools/bundler#bundling-for-the-web
- Other web bundlers don't yet work well with Deno, eslint theoretically can but has no bundling for URL modules
  https://esbuild.github.io/getting-started/#deno. Webpack does not work with Deno.
- Indirection of build, the code run is not the source. Needs file maps to debug.
-
