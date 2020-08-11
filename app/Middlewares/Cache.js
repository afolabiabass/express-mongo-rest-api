const Cache = (request, response, next) => {
  let { id } = request.params;
  if (request.path === '/teams') {
    id = 'teams'
  }
  if (request.path === '/fixtures') {
    id = 'fixtures'
  }

  if (id) {
    global.RedisClient.get(id, (error, data) => {
      if (error) {
        response.status(500).send(error.message);
      } else {
        if (data != null) {
          response.status(200).send({
            status: true,
            data: JSON.parse(data)
          });
        }
      }
    });
  } else {
    next();
  }
}

module.exports = Cache
