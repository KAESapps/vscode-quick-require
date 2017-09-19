var WalkUp = require("walkup").WalkUp

module.exports = (cwd, variableName) => new Promise((resolve, reject) => {
  cwd = 'c:/projects/test-link/app1'
  var walker = new WalkUp(`*/${variableName}.js`, {cwd})
  
  , function (err, matches) {
    if (err) return reject(err)
    resolve(matches)
  })
})