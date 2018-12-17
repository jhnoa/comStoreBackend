const errors = require('@feathersjs/errors');

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }
  async setup(app) {
    this.app = app;
  }
  async create(data, params) {
    let {app} = this;
    let {
      email,
      password,
      name,
      contactNumber,
      address,
      type = 'customer',
    } = data;
    let usersService = app.service('users');
    let usersResult = await usersService.find({query: {email}});
    if (usersResult.total > 0) {
      const emailUsed = new errors.BadRequest({
        errors: 'Email Telah Terpakai',
      });
      return emailUsed;
    }
    usersResult = await usersService.create({email, password});
    let userDataService = app.service('user-data');
    let userDataResult = await userDataService.create({
      name,
      address,
      contactNumber,
      type,
      userID: usersResult._id,
    });
    return {email, name, contactNumber, address, type};
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;

// METHOD: POST
// DATA: {email, password, name, contactNumber, address, type = 'customer'}
// PARAMS:
// RETURN: {email, name, contactNumber, address, type}
// FUNCTION: Create new user with data and type
