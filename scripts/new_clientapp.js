'use strict';

const mysql = require('../services/mysql');
const util = require('../services/utils');

let appname = 'admin';
let email = 'admin1x@lth.com';
let appkey = util.generateAppkey(appname, email);
mysql.createClientApp(appname, appkey, email)
.then((result) => {
  console.log(result);
  if(result.success) 
    console.log(appkey);
})
.catch(console.log);