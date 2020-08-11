const express = require('express');
const RegisterController = require('../app/Controllers/Accounts/RegisterController');
const UserController = require('../app/Controllers/Accounts/UserController');
const LoginController = require('../app/Controllers/Accounts/LoginController');
const TicketController = require('../app/Controllers/TicketController');
const Auth = require('../app/Middlewares/Authorization');
const Cache = require('../app/Middlewares/Cache');
const Admin = require('../app/Middlewares/Admin');
const Customer = require('../app/Middlewares/Customer');
const Agent = require('../app/Middlewares/Agent');
const Router = express.Router();

Router.get('/', (request, response) => {
  response.send({ message: 'Welcome to League API' });
});

/**
 * Auth routes
 */
Router.post('/auth/register', RegisterController.register);
Router.post('/auth/login', LoginController.login);

/**
 * User routes
 */
Router.get('/users', [Auth, Admin, Cache], UserController.index);
Router.get('/users/seed', [], UserController.seed);
Router.get('/users/:id', [Cache], UserController.show);
Router.put('/users/:id', [Auth, Admin], UserController.update);
Router.delete('/users/:id', [Auth, Admin], UserController.destroy);

/**
 * Tickets routes
 */
Router.get('/tickets', [Auth, Cache], TicketController.index);
Router.get('/tickets/seed', [], TicketController.seed);
Router.get('/tickets/pending', [Auth, Agent, Cache], TicketController.pending);
Router.post('/tickets', [Auth, Customer], TicketController.store);
Router.get('/tickets/:id', [Auth, Cache], TicketController.show);
Router.post('/tickets/:id/comment', [Auth], TicketController.comment);
Router.put('/tickets/:id', [Auth, Admin], TicketController.update);
Router.delete('/tickets/:id', [Auth, Admin], TicketController.destroy);

Router.get('/status', (request, response) => {
  response.status(200).
  send("Alive");
});

module.exports = Router;
