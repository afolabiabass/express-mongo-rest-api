require('dotenv').config()

module.exports = {
  host: process.env.MONGODB_HOST,
  database: process.env.MONGODB_DATABASE,
  username: process.env.MONGODB_USERNAME,
  password: process.env.MONGODB_PASSWORD,
  replica: process.env.MONGODB_REPLICA_SET,
}
