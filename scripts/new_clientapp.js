'use strict';

const mysql = require('../lib/mysql');
const util = require('../lib/utils');

let appname = 'admin';
let email = 'admin@lth.com';
let appkey = util.generateAppkey(appname, email);
mysql.createClientApp(appname, appkey, email)
.then((result) => {
  console.log(result);
  if(result.success) 
    console.log(appkey);
})
.catch(console.log);