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
    let {password, ...data} = userDataResult.data[0];
    return {
      ...data,
    };
  }

  async update(id, data, params) {
    let {app} = this;
    let {name, contactNumber, address} = data;
    console.log(data)
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

  async patch(id, data, params) {
    let {app} = this;

    let {_id, email} = params.user;
    let usersService = app.service('users');
    let usersResult = await usersService.find({query: {_id}});
    if (usersResult.total === 1) {
      let {password} = data;
      usersResult = await usersService.update(_id, {
        id,
        email,
        password,
      });
    }
    let {password, ...result} = usersResult;
    return {...result};
  }
  async remove(id, params) {
    let {app} = this;
    let {_id} = params.user;
    let userDataService = app.service('user-data');
    let userDataResult = await userDataService.find({query: {userID: _id}});
    let {type} = userDataResult.data[0];
    return {isAuthenticated: true, type, _id};
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;

// METHOD: GET
// PARAMS:
// RETURN: {userData}
// FUNCTION: Get Logged In UserData

// METHOD: PUT
// ID:
// DATA: {name, contactNumber, address}
// PARAMS:
// RETURN: {DATA}
// FUNCTION: Update UserData of Logged In User

// METHOD: PATCH
// ID:
// DATA: {password}
// PARAMS:
// RETURN: {user}
// FUNCTION: Change Password of Logged In User
