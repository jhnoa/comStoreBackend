const errors = require('@feathersjs/errors');

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

    userDataResult = await userDataService.find({query: {...params.query}});
    return userDataResult.data;
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

    userDataResult = await userDataService.find({query: {_id: id}});
    return userDataResult.data[0];
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
