'use strict';

const mysql = require('mysql');
const serv = {};

serv.createConn = () => {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lth'
  });
};

serv.query = (query) => {
  return new Promise((resolve, reject) => {
    let conn = serv.createConn();
    conn.query(query, (error, result, fields) => {
      conn.end();
      if(error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

serv.execSetSP = async (query) => {
  const result = await serv.query(query);
  return result[0][0];
};

serv.execGetSP = async (query) => {
  const result = await serv.query(query);
  return result[0];
};

//Crea un nuevo usuario.
serv.signupUser = (user) => {
  let sql = `call create_user ("${user.username}", "${user.firstname}", "${user.lastname}", "${user.email}", "${user.password}")`;
  return serv.execSetSP(sql);
};

//Obtiene los datos de un usuario.
serv.getUserData = (username) => {
  let sql = 'select * from users where username = "' + username + '" limit 1';
  return serv.execGetSP(sql);
};

//Crea un nuevo usuario administrador.
serv.signupAdmin = (user) => {
  let sql = `call create_admin_user ("${user.firstname}", "${user.lastname}", "${user.email}", "${user.password}")`;
  return serv.execSetSP(sql);
};

//Obtiene los datos de un usuario administrador.
serv.getAdminData = (email) => {
  let sql = 'select * from admin_users where email = "' + email + '" limit 1';
  return serv.execGetSP(sql);
};

//Crea un nuevo curso.
//{ title:string, price:float, author:int }
//Return: { success:boolean, message:string }
serv.createCourse = (course) => {
  let sql = `call create_course ("${course.title}", ${course.price}, ${course.author}, "${course.alias}")`;
  return serv.execSetSP(sql);
};

//Crea un nuevo vído.
//{ course:string (alias del curso), title:string, url:string, alias:string }
//Return: { success:boolean, message:string }
serv.createVideo = (video) => {console.log(video);
  let sql = `call create_video ("${video.course}", "${video.title}", "${video.url}", "${video.alias}")`;
  return serv.execSetSP(sql);
};

//Registra un curso comprado.
// { user:int, course:int }
//Return: { success:boolean, message:string }
serv.savePurchasedCourse = (data) => {
  let sql = `call register_purchased_course (${data.user}, ${data.course})`;;
  return serv.execSetSP(sql);
};

module.exports = serv;