'use strict';
const array = {};
const delSpaces = new RegExp(/[ |\r|\n]/);

//Borra un elemento todas las veces que este aparezca en el arreglo.
//@param array El arreglo en el que se trabajará.
//@param element El elemento que se removerá de todo el arreglo.
//@return Array El arreglo sin el elemento.
array.delete = (array, element) => {
  let arr = array.slice();
  let index = arr.indexOf(element);
  while (index != -1) {
    arr.splice(index, 1);
    index = arr.indexOf(element)
  }
  return arr;
};

//Verifica si ambos arreglos tienen los mismo en orden.
//@param arr1 El primer arreglo.
//@param arr2 El segundo arreglo.
//@return boolean Si son iguales o no.
array.equals = (arr1, arr2) => {
  for(let i = 0; i < arr1.length; i++) {
    if(arr1[i] !== arr2[i])
      return false;
  }
  return true;
};

//Quita los espacios, retornos de carro y saltos de línea de un string y retorna el arreglo obtenido.
//@param str El string a limpiar.
//@return un arreglo con cada palabra del string original.
array.clearString = (str) => {
  let s = str.split(delSpaces);
  s = array.delete(s, '');
  return s;
};

module.exports = array;