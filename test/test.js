var path = require('path'),
    exec = require('child_process').exec,
    assert = require('assert')

var testCmd = path.resolve('echo-name'),
    output = ['nestest', 'nestest2', 'nestest3', ''].join('\n\n\n')

describe('nestest', function() {
  it('should sequentially descend through all packages', function(done) {
    exec(testCmd, function(error, stdout, stderr) {
      assert(!error)
      assert(stdout === output)
      done()
    })
  })
})
