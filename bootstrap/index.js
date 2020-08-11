const database = require('./database');
const core = require('./core');

class Ignite {
  constructor() {
    //
  }

  start() {
    this.startCore();
    this.startDatabase();
  }

  startCore() {
    core.start();
    return this;
  }

  startDatabase() {
    database.connect();
    return this;
  }
}

module.exports = Ignite;
