'use strick';
const file = {};
const fs = require('fs');
const array = require('./array');

//Lee un archivo de texto y retorna cada palabra en un arreglo.
//@param path la ruta del archivo.
file.readAsArray = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: 'utf8' }, (error, data) => {
      if(error !== null) {
        return reject(error);
      }
      data = array.clearString(data);
      resolve(data);
    });
  });
};

module.exports = file;