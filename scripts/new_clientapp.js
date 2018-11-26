'use strict';

const mysql = require('../services/mysql');
const util = require('../services/utils');

let appname = 'admin';
let email = 'admin@lth.com';
let appkey = util.generateAppkey(appname, email);
mysql.createClientApp(appname, appkey, email)
.then(console.log)
.catch(console.log);