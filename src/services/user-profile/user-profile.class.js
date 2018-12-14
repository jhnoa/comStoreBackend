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
    console.log(_id);
    let userDataService = app.service('user-data');
    let userDataResult = await userDataService.find({query: {userID: _id}});
    console.log(userDataResult);
    let {name, address, contactNumber} = userDataResult.data[0];
    return {
      name,
      address,
      contactNumber,
    };
  }

  async update(id, data, params) {
    let {app} = this;
    let {name, contactNumber, address} = data;
    let {_id} = params.user;
    let userDataService = app.service('user-data');
    let userDataResult = await userDataService.find({query: {userID: _id}});
    let {_id: userDataID, ...otherData} = userDataResult.data[0];
    userDataResult = await userDataService.update(userDataID, {
      ...otherData,
      name,
      contactNumber,
      address,
    });
    console.log(userDataResult);
    return data;
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
