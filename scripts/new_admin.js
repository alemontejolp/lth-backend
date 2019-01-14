'use strict';

const mysql = require('../lib/mysql');
//const bcrypt = require('bcrypt');
const util = require('../lib/utils');

let admin = {
  email: 'amontejo@lth.com',
  firstname: 'Alexis',
  lastname: 'Montejo Lopez',
  password: 'qwerty'
};

util.sign(admin.password).then(hash => {
  admin.password = hash;
  mysql.signupAdmin(admin).then(console.log).catch(console.error);
})
.catch(console.error);