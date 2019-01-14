'use strict';

const exec = require('child_process').exec;
const fs = require('fs');
const moment = require('moment');

const buildAndRun = {};

//Compila código fuente en C/C++ y retorna el nombre del binario, o el error si falla.
//@param path la ruta del código fuente
//@param build_path la ruta donde se generará el binario.
buildAndRun.build = (path, build_path) => {
  return new Promise((resolve, reject) => {
    //Genera el nombre del binario y separa el nombre del archivo de la ruta.
    let programName = moment().unix();
    path = path.split('/');
    let file = path[path.length - 1];
    path.pop();
    path = path.join('/');

    //Va al directorio y hace la compilación ahí son el nombre generado.
    let command = `cd ${path} ; g++ ${file} -o ${build_path + programName}`;

    exec(command, async (error, stdout, stderr) => {
      if(error !== null) {
        //reject(error);
        resolve({
          success: false,
          stderr: error.message
        });
      } else if(stderr !== '') {
        resolve({
          success: false,
          stderr: stderr
        });
      } else {
        resolve({
          success: true,
          programName: programName
        });
      }
    });
  });
};

//Ejecuta un binario entuvando la entrada por la entrada estándar.
//@param path la ruta del binario.
//@param stdin la entrada.
buildAndRun.run = (path, stdin) => {
  return new Promise((resolve, reject) => {
    //Separa el nombre del programa de la ruta.
    path = path.split('/');
    let program = path[path.length - 1];
    path.pop();
    path = path.join('/');

    //Va a la ruta y ejecuta el programa pasandole los datos de entrada.
    let command = `cd ${path} ; echo ${stdin} | ./${program}`;

    exec(command, (error, stdout, stderr) => {
      if(error !== null) {
        return reject(error);
      }
      return resolve({
        success: (stderr !== '') ? (false) : (true),
        stdout: stdout,
        stderr: stderr
      });
    });
  });
};

module.exports = buildAndRun;