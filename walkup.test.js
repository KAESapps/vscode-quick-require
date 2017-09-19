var WalkUp = require("node-walkup").WalkUp

const cwd = 'c:/projects/test-link/app1'
const walker = new WalkUp('**/*.js', {cwd})
let i=0
walker.on('match', file => {
  console.log('found', file)
  i++
  if (i>=5) walker.abort()
})