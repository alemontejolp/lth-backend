const compAndRun = require('../services/comp_and_run');
const file = require('../services/file');
const array = require('../services/array');
const fs = require('fs');

let programPath = '../build/1542000927';
let dataPath = './test.dat';
let stdin = fs.readFileSync(dataPath, { encoding: 'utf8' });

console.log(stdin);

function f(x) {
  console.log(x);
  console.log(x.stdout);
  console.log(array.clearString(x.stdout));
}

compAndRun.run(programPath, array.clearString(stdin).join(' '))
.then(f)
.catch(console.log);