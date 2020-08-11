'use strict'

const Ticket = require('../Models/Ticket');
const User = require('../Models/User');
const BaseController = require('./BaseController');

class TicketController extends BaseController {
  constructor() {
    super();
    this.model = Ticket;
  }

  async index (request, response, next) {
    // retrieve only tickets belonging to user
    const data = await Ticket.find({ created_by: request.session.user._id });
    if (data) {
      global.RedisClient.set('tickets', JSON.stringify(data))
      global.RedisClient.expire('tickets', 3600);
      return response.send({ status: true, data });
    }
    return response.status(400).send(data);
  }

  async pending (request, response, next) {
    const data = await Ticket.find({ status: 'pending' });
    if (data) {
      return response.send({ status: true, data });
    }
    return response.status(400).send(data);
  }

  async seed (request, response, next) {
    const customer = await User.create({
      name: 'Andy Davidson',
      email: 'andy.davidson@hey.com',
      password: 'secret',
      role: 'customer' });

    const agent = await User.create({
      name: 'Harley Johnson',
      email: 'harley.johnson@hey.com',
      password: 'secret',
      role: 'agent' });

    const tickets = [
      { created_by: customer._id, body: 'Help me', status: 'pending' },
      { home: customer._id,  body: 'Give me support', status: 'pending' },
    ];

    for (ticket of tickets) {
      const ticketInstance = await Ticket.create(ticket);
      await Comment.create({ body: 'Can you provide us more updates', ticket_id: ticketInstance._id, user_id: agent._id });
    }

    return response.send({ status: true, data: 'Ticket database seeded!' });
  }

  async show (request, response, next) {
    let queryParams = { _id: request.params.id }
    // only allow customers access tickets belonging to them
    if (request.session.user.role === 'customer') {
      queryParams.created_by = request.session.user._id
    }
    const data = await Ticket.findOne(queryParams);
    if (data) {
      global.RedisClient.set(request.params.id, JSON.stringify(data))
      global.RedisClient.expire(request.params.id, 3600);
      return response.send({ status: true, data });
    }
    return response.status(404).send({ status: false, message: 'Ticket not found' });
  }

  async store (request, response, next) {
    const queryParams = request.body;
    queryParams.created_by = request.session.user._id;
    const modelInstance = new Ticket(queryParams)
    const data = await modelInstance.save()
    if (data) {
      return response.status(201).send({ status: true, data });
    }
    return response.status(400).send({ status: false, message: 'Ticket not saved' });
  }

  async comment (request, response, next) {
    let queryParams = { _id: request.params.id }
    // only allow customers access tickets belonging to them
    if (request.session.user.role === 'customer') {
      queryParams.created_by = request.session.user._id
    }

    let data = null;
    const ticketInstance = await Ticket.findOne(queryParams).populate('comments');
    // only allow comment on ticket only if agent has commented on it
    let dataParams = request.body;
    dataParams.ticket_id = ticketInstance._id;
    dataParams.user_id = request.session.user._id;
    if (ticketInstance.comments.length === 0 && request.session.user.role === 'agent') {
      const commentInstance = new Comment(dataParams);
      data = await commentInstance.save()
    }
    if (ticketInstance.comments.length >= 1
      && (request.session.user.role === 'agent' || request.session.user.role === 'customer')) {
      const commentInstance = new Comment(dataParams);
      data = await commentInstance.save()
    }

    if (data) {
      return response.send({ status: true, data });
    }

    return response.status(400)
      .send({ status: false, message: 'Ticket not commented' });
  }

  async update (request, response, next) {
    const data = await Ticket.update({ _id: request.params.id }, request.body);
    if (data) {
      return response.send({ status: true, data });
    }
    return response.status(400).send({ status: false, message: 'Ticket not updated' });
  }

  async destroy (request, response, next) {
    const data = await Ticket.deleteOne({ _id: request.params.id });
    if (data) {
      return response.send({ status: true, data });
    }
    return response.status(400).send({ status: false, message: 'Ticket not deleted' });
  }
}

module.exports = new TicketController();
