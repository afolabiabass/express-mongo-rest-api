const mongoose = require('mongoose');
const config = require('../config');
const app = require('../bootstrap/core').app;
const supertest = require("supertest");
const request = supertest(app);
const Ticket = require('../app/Models/Ticket');
const User = require('../app/Models/User');

const sampleTicketData = { body: 'Give me support', status: 'pending' };
let customer = null;
let agent = null;

describe('Ticket Test', () => {
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

    await User.deleteOne({ email: 'andy.davidson@hey.com' });
    customer = await User.create({
      name: 'Andy Davidson',
      email: 'andy.davidson@hey.com',
      password: 'secret',
      role: 'customer' });

    await User.deleteOne({ email: 'andy.johnson@hey.com' });
    agent = await User.create({
      name: 'Andy Johnson',
      email: 'andy.johnson@hey.com',
      password: 'secret',
      role: 'agent' });
  });

  afterAll(function(done) {
    Ticket.collection.drop();
    done();
  });

  it('test creating ticket', async () => {
    sampleTicketData.created_by = customer._id;
    let ticketInstance = new Ticket(sampleTicketData);
    ticketInstance = await ticketInstance.save();
    expect(ticketInstance._id).toBeDefined();
    expect(ticketInstance.home).toBe(sampleTicketData.home);
    expect(ticketInstance.away).toBe(sampleTicketData.away);
  });

  it('retrieve all tickets', function(done) {
    Ticket.find({}, function(error, Ticket) {
      expect(Ticket.length).toBe(1);
      done();
    });
  });

  it('retrieve single ticket by name', function(done) {
    Ticket.findOne({home: sampleTicketData.home }, function(error, ticket) {
      expect(ticket.away).toStrictEqual(sampleTicketData.away);
      done();
    });
  });

  it('test should return list of tickets for logged in user', function(done) {
    request
      .get('/tickets')
      .end(function (error, response) {
        expect(response.statusCode).toBe(200);
        expect(response.header.location).toBe('/tickets');
      });
    done();
  });

  it('customer should not be able to comment on ticket unless agent has commented', async function(done) {
    sampleTicketData.created_by = customer._id;
    let ticketInstance = new Ticket(sampleTicketData);
    ticketInstance = await ticketInstance.save();
    const response = await request
      .post(`/api/v1/tickets/${ticketInstance._id}/comment`)
      .send({
        body: 'Hello'
      });
    expect(response.statusCode).toBe(200);
    done();
  });

  it('agent should be able to comment on ticket', async function(done) {
    sampleTicketData.created_by = customer._id;
    let ticketInstance = new Ticket(sampleTicketData);
    ticketInstance = await ticketInstance.save();
    const response = await request
      .post(`/api/v1/tickets/${ticketInstance._id}/comment`)
      .send({
        body: 'Hello'
      });
    expect(response.statusCode).toBe(200);
    done();
  });
})
