/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }
  async setup(app) {
    this.app = app;
  }
  async find(params) {
    let {app} = this;

    let {_id} = params.user;
    let userDataService = app.service('user-data');
    let userDataResult = await userDataService.find({query: {userID: _id}});
    let {type} = userDataResult.data[0];

    if (type !== 'admin') {
      const notAdmin = new errors.BadRequest({
        errors: 'User type mismatch',
      });
      return notAdmin;
    }

    let chatService = app.service('chat');
    let chatResult = await chatService.find({query: {$sort: {createdAt: -1}}});
    let result = [];
    for (let index = 0; index < chatResult.data.length; index++) {
      const element = chatResult.data[index];
      let {_id, userId, createdAt} = element;
      let lastChat = element.data.pop();
      result.push({_id, userId, lastChat, createdAt});
    }
    return result;
  }

  async get(id, params) {
    let {app} = this;

    let {_id} = params.user;
    let userDataService = app.service('user-data');
    let userDataResult = await userDataService.find({query: {userID: _id}});
    let {type} = userDataResult.data[0];

    if (type !== 'admin') {
      const notAdmin = new errors.BadRequest({
        errors: 'User type mismatch',
      });
      return notAdmin;
    }

    let chatService = app.service('chat');
    let chatResult = await chatService.get(id);
    return chatResult;
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return {id};
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
