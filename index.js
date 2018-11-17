'use strict';
const server = require('./server');
const conf = require('./config');

server.listen(conf.port, () => {
  console.log('----------------------------------------');
  console.log(`Server running on PORT: ${conf.port}.`);
  console.log('----------------------------------------');
});