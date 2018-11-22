const mysql = require('../services/mysql');

//mysql.getAdminData('algo').then(console.log).catch(console.log);

mysql.query('call t()').then(console.log)