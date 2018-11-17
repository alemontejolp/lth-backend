//Maneja el sistema de archivos. Documentación: https://nodejs.org/api/fs.html
const fs = require('fs');

//Lee un arvhivo, y lo despliega codificado en UTF-8 (nuestros acracteres).
//Paráteros: ruta, codificación, callback. Tal que así:
fs.readFile('./file.dat', {encoding: 'utf8'}, (error, data) => {
  if(error !== null) {
    console.log(error);
    return;
  }
  console.log(data);
});