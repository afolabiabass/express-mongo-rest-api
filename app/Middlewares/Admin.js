const Admin = (request, response, next) => {
  if (request.session.user) {
    if (request.session.user.role  === 'admin') {
      return next()
    }
  }

  response.status(401).send('Unauthorized')
}

module.exports = Admin
