const Passport = require('passport')

const Authorization = (request, response, next) => {
  Passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) {
      response.status(401).send({ status: false, message: error.message })
    }

    if (user) {
      request.session.user = user;
      next()
    } else {
      response.status(401).send('Unauthorized')
    }
  })(request, response, next);
}

module.exports = Authorization
