var test = require('tape')
  , fs = require('fs')
  , resolve = require('path').resolve
  , spawn = require('child_process').spawn

test('basic', function (t) {
  t.plan(2)

  var bin = resolve(__dirname, '../cli.js')
  var expected = fs.readFileSync(__dirname + '/fixtures/expected.js', 'utf8')
  var cp = spawn('node', [bin, '-c', 'fixtures', 'a.js'], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', process.stderr]
  })

  var actual = ''
  cp.stdout.on('data', function (chunk) {
    actual+= chunk
  }).on('close', function (code) {
    t.ok(!code, 'code ok')
    t.is(actual.trim(), expected.trim(), 'output ok')
  })
})
