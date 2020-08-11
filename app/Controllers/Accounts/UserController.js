'use strict'

const User = require('../../Models/User');
const BaseController = require('../BaseController');

class UserController extends BaseController {
  constructor() {
    super();
    this.model = User;
  }

  async index (request, response, next) {
    const data = await User.find();
    if (data) {
      global.RedisClient.set('users', JSON.stringify(data))
      global.RedisClient.expire('users', 3600);
      return response.send({ status: true, data });
    }
    return response.status(400).send(data);
  }

  async seed (request, response, next) {
    const users = [
      { name: 'John Smith', email: 'john.smith@hey.com', password: 'secret', role: 'admin' },
      { name: 'Mike Arnold', email: 'mike.arnold@hey.com', password: 'secret', role: 'agent' },
      { name: 'Marcel Mikelson', email: 'marcel.mikelson@hey.com', password: 'secret', role: 'customer' },
    ];

    for (user of users) {
      const userInstance = new User(user);
      userInstance.save();
    }

    return response.send({ status: true, data: 'User database seeded!' });
  }

  async show (request, response, next) {
    const data = await User.findOne({ _id: request.params.id });
    if (data) {
      global.RedisClient.set(request.params.id, JSON.stringify(data))
      global.RedisClient.expire(request.params.id, 3600);
      return response.send({ status: true, data });
    }
    return response.status(404).send({ status: false, message: 'User not found' });
  }

  async update (request, response, next) {
    const data = await User.update({ _id: request.params.id }, request.body);
    if (data) {
      return response.send({ status: true, data });
    }
    return response.status(400).send({ status: false, message: 'User not updated' });
  }

  async destroy (request, response, next) {
    const data = await User.deleteOne({ _id: request.params.id });
    if (data) {
      return response.send({ status: true, data });
    }
    return response.status(400).send({ status: false, message: 'User not deleted' });
  }
}

module.exports = new UserController();
