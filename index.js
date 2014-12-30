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
            if (file.match(/^(.git|node_modules)$/)) return
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

function fail(err) {
  console.error(chalk.red(err))
  process.exit(1)
}
