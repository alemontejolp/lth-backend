'use strict';

const mysql = require('mysql');
const serv = {};

function verifyResponse(result) {
  let res = result[0] || {};
  if(res.message) {
    return {
      success: false,
      message: result[0].message
    }
  }
  return {
    success: true,
    data: result
  }
}

serv.createConn = () => {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lth'
  });
};

//Ejecuta la consulta.
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

//Ejecuta un procedimiento almacenado de configuración.
serv.execSetSP = async (query) => {
  const result = await serv.query(query);
  return result[0][0];
};

//Ejecuta un procedimiento almacenado de obtención de datsos.
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
  let sql = `call create_course ("${course.title}", "${course.description}", ${course.price}, ${course.author}, "${course.alias}")`;
  return serv.execSetSP(sql);
};

//Crea un nuevo vído.
//{ course:string (alias del curso), title:string, url:string, alias:string }
//Return: { success:boolean, message:string }
serv.createVideo = (video) => {//console.log(video);
  let sql = `call create_video ("${video.course}", "${video.title}", "${video.description}", "${video.url}", "${video.alias}")`;
  return serv.execSetSP(sql);
};

//Registra un curso comprado.
// { user:int, course:int }
//Return: { success:boolean, message:string }
serv.savePurchasedCourse = (data) => {
  let sql = `call register_purchased_course (${data.user}, ${data.course})`;;
  return serv.execSetSP(sql);
};

//Busca un curso, trae una cantidad limitada y en orden descenente por defecto.
// find: Expresión regular a buscar
// start: registros a saltar.
// limit: registros a traer.
// asc: si es ascendento o no [1|0].
serv.findCourses = (find, start, limit, asc) => {
  let sql = `call find_courses("${find}", ${start}, ${limit}, ${asc})`;
  return serv.query(sql);
  //return serv.execGetSP(sql);
};

//Obtiene videos de un curso.
// course: Alias del curso,
// user: id del usuario.
// start: registros a saltar.
// limit: registros a traer.
serv.getVideos = (course, user, start, limit) => {
  let sql = `call get_videos("${course}", ${user}, ${start}, ${limit})`;
  return serv.query(sql).then(verifyResponse);
  //return serv.execGetSP(sql).then(verifyResponse);
};

//Registra un curso como comprado.
// user: id del usuario.
// course: alias del curso.
serv.registerPurchasedCourse = (user, course) => {
  let sql = `call register_purchased_course(${user}, "${course}")`;
  return serv.execSetSP(sql);
};

//Obtiene los datos públicos de un vídeo.
// video: alias del video.
// user: id del usuario.
serv.getVideoData = (video, user) => {
  let sql = `call get_video_data("${video}", ${user})`;
  return serv.execGetSP(sql).then(verifyResponse);
};

//Obtiene los cursos comprados de un usaurio.
// user: id del usuario.
serv.getPurchasedCourses = (user, start, limit) => {
  let sql = `call get_purchased_courses(${user}, ${start}, ${limit})`;
  return serv.query(sql).then(verifyResponse);
  //return serv.execGetSP(sql).then(verifyResponse);
};

//Obtiene datos del usuario para desplegar.
serv.getUserById = (user) => {
  let sql = `call get_user_by_id(${user})`;
  return serv.execGetSP(sql).then(verifyResponse);
};

//Registra una app cliente.
serv.createClientApp =(appname, appkey, email) => {
  let sql = `call create_clientapp("${appname}", "${appkey}", "${email}")`;
  return serv.execSetSP(sql);
};

//Obtiene todos los datos de una app cliente.
serv.getAppData = (appkey) => {
  let sql = `select * from clientapps where clientapps.appkey = "${appkey}" and clientapps.active = 1 limit 1`;
  return serv.execGetSP(sql);
};

module.exports = serv;