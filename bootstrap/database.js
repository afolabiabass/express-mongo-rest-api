'use strict'

const config = require('../config')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

mongoose.connection.on('connected', () => {
  console.log('Database connected successfully!')
})

mongoose.connection.on('error', (error) => {
  console.log(`Failed to connect to Database: ${error}`)
  process.exit(-1)
})

if (config.app.env === 'development') {
  mongoose.set('debug', true)
}

exports.connect = () => {
  mongoose.connect(process.env.MONGODB_URI || `mongodb://${config.database.username}:${config.database.password}@${config.database.host}/${config.database.database}?authSource=admin&retryWrites=true&w=majority`, {
    keepAlive: 1,
    useNewUrlParser: true,
    useCreateIndex: true
  })

  return mongoose.connection
}
