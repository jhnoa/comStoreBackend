const errors = require('@feathersjs/errors');

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }
  async setup(app) {
    this.app = app;
  }
  // TODO: admin only, get all transaction except params is available
  async find(params) {
    let {app} = this;

    let {_id} = params.user;
    let userDataService = app.service('user-data');
    let userDataResult = await userDataService.find({query: {userID: _id}});
    let {type} = userDataResult.data[0];

    if (type !== 'admin') {
      const notAdmin = new errors.BadRequest({
        errors: {
          email: 'User type mismatch',
        },
      });
      return notAdmin;
    }
    let query;
    console.log(params.query);
    if (Object.keys(params.query).length > 0) {
      query = {query: {...params}};
    } else {
      query = {};
    }
    console.log(query);
    let transaksiService = app.service('transaksi');
    let transaksiResult = await transaksiService.find(query);
    console.log(transaksiResult);
    return transaksiResult.data;
  }

  // TODO: admin only, finalize transaction
  // DATA: {transaksiId, userId, [status = 'selesai']}
  async patch(id, data, params) {
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

    let {transaksiId, userId, status} = data;
    let transaksiService = app.service('transaksi');
    let transaksiResult = await transaksiService.find({
      query: {
        _id: transaksiId,
        userId,
      },
    });
    if (transaksiResult.total === 0) {
      const noData = new errors.BadRequest({
        errors: 'Transaksi tidak ditemukan',
      });
      return noData;
    } else {
      transaksiResult = await transaksiService.update(
        transaksiResult.data[0]._id,
        {
          ...transaksiResult.data[0],
          status: status === undefined ? 'selesai' : status,
        },
      );
    }
    return data;
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;

// METHOD: GET
// PARAMS:
// RETURN: [{transaksi}]
// FUNCTION: Get all transaction or filter by params

// METHOD: PATCH
// ID:
// DATA: {transaksiId, userId, [status]}
// PARAMS:
// RETURN: {DATA}
// FUNCTION: Change transaction status from pembayaran to selesai by default or change it to status
