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

    let result = [];
    for (let index = 0; index < transaksiResult.data.length; index++) {
      const element = transaksiResult.data[index];
      let userData = await userDataService.find({
        query: {userID: element.userId},
      });
      element.userData = userData.data[0];
      let simulationService = app.service('perakitan');
      let simulationData = await simulationService.get(element.simulasiId);

      let partDataResult = [];
      if (simulationData.parts.length > 0) {
        let catalogService = app.service('catalog');

        let {parts} = simulationData;

        for (let index = 0; index < parts.length; index++) {
          const part = parts[index];
          let partData = await catalogService.find({
            query: {
              itemId: part.itemId,
            },
          });
          console.log(part);
          partData = {...partData.data[0], ...part};
          partDataResult.push(partData);
        }
      }
      simulationData.parts = partDataResult;
      element.simulasiData = simulationData;
      result.push(element);
    }

    console.log(JSON.stringify(result));
    return result;
  }

  // Make GET 1 data transaksi

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
