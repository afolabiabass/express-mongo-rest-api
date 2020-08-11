const Agent = (request, response, next) => {
  if (request.session.user) {
    if (request.session.user.role  === 'agent') {
      return next()
    }
  }

  response.status(401).send('Unauthorized')
}

module.exports = Agent
