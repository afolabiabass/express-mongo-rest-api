const Customer = (request, response, next) => {
  if (request.session.user) {
    if (request.session.user.role  === 'customer') {
      return next()
    }
  }

  response.status(401).send('Unauthorized')
}

module.exports = Customer
