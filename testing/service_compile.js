const compAndRun = require('../services/comp_and_run');

let path = './name.cpp';
let build_path = '../build/';

function f(x) {
  console.log(x);
  console.log(x.success);
  console.log(x.programName);
}

compAndRun.compile(path, build_path)
.then(f)
.catch(f);