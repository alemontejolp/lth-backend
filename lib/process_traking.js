'use strict';

const moment = require("moment");

class ProcessTracking {
  constructor(conf = {}) {
    this.process = conf.process;
    this.method = conf.method;
    this.queue = (conf.queue) ? (conf.queue) : ([]);
    this.time = moment();
  }

  push(message) {
    this.queue.push(message);
  }
  
  print() {
    console.log(`--- Process [${this.method}]: ${this.process}`);
    for (let m of this.queue) {
      console.log('-> ' + m);
    }
    console.log(`--- Process ended on time: (${moment().diff(this.time)}).`);
  }
}

module.exports = ProcessTracking;