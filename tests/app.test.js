const app = require('../bootstrap/core').app;
const supertest = require("supertest");
const request = supertest(app);

describe('App Status', () => {
  it('Should return Alive', (done) => {
    request
      .get('/api/v1/status')
      .end((error, response) => {
        if (error) {}
        expect(response.status).toBe(200);
        done()
      })
  })

  it('Not Found', (done) => {
    request
      .get('/random')
      .end((error, response) => {
        if (error) {}
        expect(response.status).toBe(404);
        done()
      })
  })
})
