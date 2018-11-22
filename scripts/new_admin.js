'use strict';

const mysql = require('../services/mysql');
const bcrypt = require('bcrypt');

let admin = {
  email: 'amontejo@lth.com',
  firstname: 'Alexis',
  lastname: 'Montejo Lopez',
  password: 'qwerty'
};

bcrypt.hash(admin.password, 10).then(hash => {
  admin.password = hash;
  mysql.signupAdmin(admin).then(console.log).catch(console.error);
})
.catch(console.error);