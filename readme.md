# jscriptify

**Make a bundle for [JScript](https://en.wikipedia.org/wiki/JScript), so you can `require()` stuff from your script. Like [browserify](https://github.com/substack/node-browserify#readme), but targeted at the [Windows Script Host](https://en.wikipedia.org/wiki/Windows_Script_Host) engine.** Roughly equivalent to:

```bash
browserify --bare input.js | uglifyjs \
  --preamble this.global=this.window=this;
```

[![npm status](http://img.shields.io/npm/v/jscriptify.svg?style=flat-square)](https://www.npmjs.org/package/jscriptify)

## cli

Three ways to do the same thing:

```bash
cscriptify lib/input.js > lib/bundle.js
cscriptify --basedir lib < lib/input.js > lib/bundle.js
cscriptify --cwd lib input.js --output bundle.js
```

The `cwd` parameter affects input and output location as well as the `basedir`, which is passed to browserify. The `basedir`, `cwd` and `output` parameters are aliased as `b`, `c` and `o`:

```bash
cscriptify -b lib < lib/input.js > lib/bundle.js
cscriptify -c lib input.js -o bundle.js
```

To run a bundled script: `cscript bundle.js`

I might include polyfills in the future, but I decided against it for now because it needs to be selective; just throwing `es5-shim` in there can slow a script down by 10%. If you need JSON support, I found [json3](http://bestiejs.github.io/json3/) works well:

```js
var JSON = require('json3')
var json = JSON.stringify({ beep: 'boop' })
WScript.StdOut.Write(json)
```

## install

With [npm](https://npmjs.org) do:

```
npm install -g jscriptify
```

## license

[MIT](http://opensource.org/licenses/MIT) © Vincent Weevers
