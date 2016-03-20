#!/usr/bin/env node

var browserify = require('browserify')
  , uglify = require('uglify-js')
  , concat = require('concat-stream')
  , fs = require('fs')
  , resolve = require('path').resolve

var argv = require('yargs')
  .string('output').alias('o', 'output')
  .string('cwd').alias('c', 'cwd')
  .string('basedir').alias('b', 'basedir')
  .argv;

var usage =
  [ 'Make a bundle for Windows cscript. Usage (all the same):\n'
  , '> jscriptify lib/input.js > lib/bundle.js'
  , '> jscriptify --basedir lib < lib/input.js > lib/bundle.js'
  , '> jscriptify --cwd lib input.js --output bundle.js'
  , ''
  , 'The cwd parameter affects input and output location as well '
  , 'as the basedir, which is passed to browserify.'
  , ''
  , 'The basedir, cwd and output parameters are aliased as b, c and o:'
  , ''
  , '> jscriptify -b lib < lib/input.js > lib/bundle.js'
  , '> jscriptify -c lib input.js -o bundle.js'
  , ].join('\n')

if (argv.output) {
  var output = fs.createWriteStream(resolve(argv.cwd || '.', argv.output))
} else {
  output = process.stdout
}

function bundle (entries) {
  output.write('this.global=this.window=this;')

  var b = browserify(entries, {
    bare: true,
    basedir: argv.basedir || argv.cwd
  }).bundle()

  b.pipe(concat(function (buffer) {
    output.write(uglify.minify(buffer.toString(), {
      warnings: true,
      unsafe: true,
      fromString: true
    }).code)
  }))
}

if (argv.help) {
  console.log(usage)
} else if (argv._.length) {
  bundle(argv._.map(function (file) {
    return resolve(argv.cwd || '.', file)
  }))
} else if (!process.stdin.isTTY) {
  bundle(process.stdin)
} else {
  console.log(usage)
}
