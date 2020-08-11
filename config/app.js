require('dotenv').config()

module.exports = {
  host: process.env.HOST,
  key: process.env.APP_KEY,
  port: process.env.PORT,
  env: process.env.NODE_ENV,
}
