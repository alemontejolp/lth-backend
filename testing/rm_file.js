const fs = require('fs');

let programPath = '../build/1542000927';

//Borra un archivo.
fs.unlink(programPath + '.exe', console.log);