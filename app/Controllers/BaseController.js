/**
 * @property model
 */
class BaseController {
  constructor(model) {
    this.model = model;
  }

  async index (request, response, next) {
    const data = await this.model.count();
    if (data) {
      return response.send({status: true, data });
    }
    return response.status(400).send(data);
  }

  async show (request, response, next) {
    const data = await this.model.findOne({ _id: request.params.id });
    if (data) {
      return response.send({ status: true, data });
    }
    return response.status(400).send(data);
  }

  async pluck (request, response, next) {
    const data = await this.model.find({}, { _id: 1, name: 1 });
    if (data) {
      return response.send({ status: true, data });
    }
    return response.status(400).send(data);
  }

  async store (request, response, next) {
    const modelInstance = new this.model(request.body)
    const data = await modelInstance.save()
    if (data) {
      return response.send({ status: true, data });
    }
    return response.status(400).send(data);
  }

  async update (request, response, next) {
    const data = await this.model.update({ _id: request.params.id }, request.body);
    if (data) {
      return response.send({ status: true, data });
    }
    return response.status(400).send(data);
  }

  async duplicate (request, response, next) {
    const instance = await this.model.findOne({ _id: request.params.id });
    if (instance) {
      const copiedInstance = await new this.model(instance);

      return response.send({ status: true, data: copiedInstance });
    }
    return response.status(400).send(data);
  }

  async destroy (request, response, next) {
    const data = await this.model.deleteOne({ _id: request.params.id });
    if (data) {
      return response.send({ status: true, data });
    }
    return response.status(400).send(data);
  }
}

module.exports = BaseController;
