const Ignite = require('./bootstrap');

const app = new Ignite;
app.startCore()
  .startDatabase();
