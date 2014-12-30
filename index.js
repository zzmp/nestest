var spawn = require('child_process').spawn,
    fs = require('fs'),
    path = require('path'),
    Promise = require('bluebird'),
    chalk = require('chalk')

module.exports = {
  command: path.join(__dirname, '/node_modules/.bin/npm'),
  args: ['test'],
  bootstrap: descend.bind(null, process.cwd(), doCommand)
}

function doCommand(dir) {
  if (/npm$/.test(module.exports.command))
    if (isLoop(dir)) return Promise.resolve()

  var npmTest = spawn(module.exports.command, module.exports.args, { cwd: dir })

  npmTest.stdout.on('data', function(data) { console.log(data.toString()) })
  npmTest.stderr.on('data', function(data) { console.error(chalk.red(data.toString())) })

  npmTest.on('error', function(error) { console.log(dir, error) })

  return new Promise(function(resolve) {
    npmTest.on('close', function(code) {
      if (code) process.exit(code)
      else resolve()
    })
  })
}

function descend(dir, iterator) {
  return new Promise(function(resolve) {
    fs.readdir(dir, function(err, files) {
      hasPackage(dir, files)
        .then(doCommand)
        .finally(function() { 
          return Promise.each(files, function(file) {
            if ((/^(.git|node_modules)$/).test(file)) return
            else return new Promise(function(resolve) {
              var filePath = path.join(dir, file)
              
              fs.stat(filePath, function(err, stats) {
                if (err) fail(err);
                else if (stats.isDirectory())
                  descend(filePath, iterator).then(resolve)
                else resolve()
              })
            })
          })
        }).then(resolve)
    })
  })
}

function hasPackage(dir, files) {
  return new Promise(function(resolve, reject) {
    (~files.indexOf('package.json')) ? resolve(dir) : reject()
  })
}

function isLoop(dir) {
  var script = /^run(|-script)$/.test(module.exports.args[0]) ?
    module.exports.args[1] : module.exports.args[0]
  var scripts = require(path.join(dir, 'package.json')).scripts

  for (var key in scripts) {
    if ((new RegExp('[(pre|post)]*' + script)).test(key) && /nestest/.test(scripts[key]))
      return true
  }
}

function fail(err) {
  console.error(chalk.red(err))
  process.exit(1)
}
