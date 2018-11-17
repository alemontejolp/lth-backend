const exec = require('child_process').exec;
const array = require('../services/array');

let command = `echo Ale 
4 
9 8 7 6 
| name`;
let c = 'Tu nombre es: Ale y estos son tus datos:\r\n9\r\n8\r\n7\r\n6';
let delSpaces = new RegExp(/[ |\r|\n]/);

exec(command, (error, stdout, stderr) => {
  if(error !== null) {
    console.log(error);
  } else if(stderr !== '') {
    console.log(stderr);
  } else {
    console.log(stdout);
    console.log('Comparison:');
    stdout = stdout.split(delSpaces);
    stdout = array.delete(stdout, '');
    c = c.split(delSpaces);
    c = array.delete(c, '');
    console.log(array.equals(c, stdout));
  }
});