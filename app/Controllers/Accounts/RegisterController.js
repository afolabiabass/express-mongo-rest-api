'use strict'

const User = require('../../Models/User');
const jwt = require('jsonwebtoken');
const config = require('../../../config');

const RegisterController =  {
  register: async (request, response, next) => {
    try {
      let UserInstance = new User(request.body)
      UserInstance = await UserInstance.save()
      const payload = {
        sub: UserInstance.id
      }
      const token = jwt.sign(payload, config.app.key)
      response.status(200)
      response.send({
        status: true,
        message: 'User registered successfully',
        data: {
          token: token,
          user: UserInstance
        }
      })
    } catch (error) {
      response.status(400)
        .send({
          status: false,
          message: error.message || 'User registration failed',
        })
    }
  }
}

module.exports = RegisterController

