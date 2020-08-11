'use strict'

const config = require('../config')
const express = require('express')
const uuid = require('uuid')
const bodyParser = require('body-parser')
const session = require("express-session")
const redis = require('redis')
// const ErrorHandler = require('./app/Exceptions/Handler')
const routes = require('../routes')

const User = require('../app/Models/User')
const Passport = require('passport')
const PassportJwt = require('passport-jwt')

const app = express()
const IsInProduction = config.app.env === 'production'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const RedisStore = require('connect-redis')(session)
if (process.env.REDIS_URL) {
  global.RedisClient = redis.createClient(process.env.REDIS_URL)
} else {
  global.RedisClient = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    db: 0,
  })
}
global.RedisClient.on('error', (error) => {
  console.log(error.message)
})

app.use(session({
  genid: () => {
    return uuid.v4()
  },
  store: new RedisStore({ client: global.RedisClient }),
  secret: config.app.key,
  resave: false,
  cookie: { secure: IsInProduction },
  saveUninitialized: true
}))

const ExtractJwt = PassportJwt.ExtractJwt
const JwtStrategy = PassportJwt.Strategy
const JwtOptions = {
  secretOrKey: config.app.key,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}
Passport.serializeUser(function(user, done) {
  done(null, user._id);
});

Passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
app.use(Passport.initialize())
app.use(Passport.session())
Passport.use('jwt', new JwtStrategy(JwtOptions, function (payload, done) {
  User.findOne({ _id: payload.sub }, function(error, user) {
    if (error) {
      return done(error, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, null);
    }
  });
}));

app.use('/api/v1', routes)

// app.use(ErrorHandler)

exports.start = () => {
  app.listen(config.app.port || 3333, (error) => {
    if (error) {
      console.log(`Error : ${error}`)
      process.exit(-1)
    }

    console.log(`${config.app.host || 'localhost'} is running on ${config.app.port}`)
  })
}

exports.app = app
