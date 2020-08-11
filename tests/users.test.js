const mongoose = require('mongoose');
const config = require('../config');
const app = require('../bootstrap/core').app;
const supertest = require("supertest");
const request = supertest(app);
const User = require('../app/Models/User');

const sampleUserData = { name: 'Tester', email: 'test@hey.com', password: 'secret' };

describe('User Test', () => {
  beforeAll(async () => {
    await mongoose.connect(`mongodb://${config.database.username}:${config.database.password}@${config.database.host}/${config.database.database}?authSource=admin&retryWrites=true&w=majority`, {
      keepAlive: 1,
      useNewUrlParser: true,
      useCreateIndex: true
    }, (error) => {
      if (error) {
        console.log(error);
        process.exit(1);
      }
    })
  });

  afterAll(function(done) {
    User.collection.drop();
    done();
  });

  it('test creating user', async () => {
    let userInstance = new User(sampleUserData);
    userInstance = await userInstance.save();
    expect(userInstance._id).toBeDefined();
    expect(userInstance.name).toBe(sampleUserData.name);
  });

  it('retrieve all users', function(done) {
    User.find({}, function(error, User) {
      expect(User.length).toBe(1);
      done();
    });
  });

  it('retrieve single user by name', function(done) {
    User.findOne({name: sampleUserData.name }, function(error, user) {
      expect(user.name).toBe(sampleUserData.name);
      done();
    });
  });

  it('test should return list of users for logged in user', async function(done) {
    const response = await request
      .get('/api/v1/users');

    expect(response.statusCode).toBe(200);
    expect(response.header.location).toBe('/api/v1/users');

    done();
  });
})
