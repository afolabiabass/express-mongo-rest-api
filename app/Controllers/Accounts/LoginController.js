'use strict'

const User = require('../../Models/User');
const jwt = require('jsonwebtoken');
const config = require('../../../config');

const LoginController =  {
  login: async (request, response, next) => {
    try {
      const { email, password } = request.body;
      const UserInstance = await User.findOne({ email })

      if (UserInstance && UserInstance.verifyPassword(password)) {
        const payload = {
          sub: UserInstance._id
        }
        const token = jwt.sign(payload, config.app.key)
        response.status(200)
        return response.send({
          status: true,
          message: 'Login successfully',
          data: {
            token: token,
            user: UserInstance
          }
        })
      }

      return response.status(404).send({
        status: false,
        message: 'Invalid email or password'
      })
    } catch (error) {
      response.status(400).send({
        status: false,
        message: error.message || 'Invalid email or password'
      })
    }
  }
}

module.exports = LoginController

