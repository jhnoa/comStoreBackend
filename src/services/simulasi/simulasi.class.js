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
    let {_id: userId} = params.user;
    let perakitanService = app.service('perakitan');
    let perakitanResult = await perakitanService.find({
      query: {userId, status: 'simulasi'},
    });
    if (perakitanResult.total === 0) {
      perakitanResult = await perakitanService.create({userId});
      return perakitanResult;
    }
    let queryResult = perakitanResult.data[0];
    let partDataResult = [];
    let returnResult = {...queryResult};
    if (queryResult.parts.length > 0) {
      let catalogService = app.service('catalog');

      let {parts} = queryResult;

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
      returnResult = {...queryResult, parts: partDataResult};
    }

    return returnResult;
  }

  async create(data, params) {
    let {app} = this;
    let {_id: userId} = params.user;
    let perakitanService = app.service('perakitan');
    let perakitanResult = await perakitanService.find({
      query: {userId, status: 'simulasi'},
    });
    console.log(perakitanResult);
    if (perakitanResult.total === 0) {
      perakitanResult = await perakitanService.create({userId});
      console.log(perakitanResult);

      return perakitanResult;
    } else {
      perakitanResult = await perakitanService.remove(
        perakitanResult.data[0]._id,
      );
      console.log(perakitanResult);

      perakitanResult = await perakitanService.create({userId});
      console.log(perakitanResult);

      return perakitanResult;
    }
  }

  async update(id, data, params) {
    let {app} = this;
    let {_id: userId} = params.user;
    let perakitanService = app.service('perakitan');
    let perakitanResult = await perakitanService.find({
      query: {userId, status: 'simulasi'},
    });
    let catalogService = app.service('catalog');
    let catalogResult = await catalogService.find({
      query: {itemId: data.itemId},
    });
    console.log(catalogResult);
    if (catalogResult.total === 0) {
      const noData = new errors.BadRequest({
        errors: 'Item tidak ditemukan',
      });
      return noData;
    }
    if (perakitanResult.total === 1) {
      let tempParts = [...perakitanResult.data[0].parts];
      let parts = [];
      let {itemId, jumlah} = data;
      let isInputted = false;
      console.log(tempParts);
      tempParts.forEach((element) => {
        if (element.itemId !== itemId) {
          parts = [...parts, element];
        } else if (element.itemId === itemId) {
          parts = [...parts, {...element, jumlah}];
          isInputted = true;
        }
      });
      if (isInputted === false) {
        parts = [...parts, data];
      }
      console.log(parts);
      perakitanResult = await perakitanService.update(
        perakitanResult.data[0]._id,
        {
          ...perakitanResult.data[0],
          parts,
        },
      );
      console.log(perakitanResult);
      let queryResult = perakitanResult;
      let partDataResult = [];
      let returnResult = {...queryResult};
      if (queryResult.parts.length > 0) {
        let catalogService = app.service('catalog');

        let {parts} = queryResult;

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
        returnResult = {...queryResult, parts: partDataResult};
      }

      return returnResult;
    }

    return data;
  }

  async patch(id, data, params) {
    let {app} = this;
    let {_id: userId} = params.user;
    let {pengiriman} = data;
    let perakitanService = app.service('perakitan');
    let perakitanResult = await perakitanService.find({
      query: {userId, status: 'simulasi'},
    });
    perakitanResult = await perakitanService.update(
      perakitanResult.data[0]._id,
      {
        ...perakitanResult.data[0],
        status: 'pembayaran',
      },
    );
    let catalogService = app.service('catalog');
    let totalPrice = 0;
    let {_id: simulasiId, parts} = perakitanResult;
    for (let index = 0; index < parts.length; index++) {
      const part = parts[index];
      let catalogResult = await catalogService.find({
        query: {itemId: part.itemId},
      });
      totalPrice += catalogResult.data[0].price * part.jumlah;
    }
    let transaksiService = app.service('transaksi');
    let transaksiResult = await transaksiService.create({
      userId,
      totalPrice,
      simulasiId,
      pengiriman,
    });
    return transaksiResult;
  }
  async remove(id, params) {
    let {app} = this;
    let {_id: userId} = params.user;
    let perakitanService = app.service('perakitan');
    let perakitanResult = await perakitanService.find({
      query: {userId, status: 'simulasi'},
    });
    console.log(params);
    let {parts: oldParts} = perakitanResult.data[0];
    let parts = [];
    oldParts.forEach((element) => {
      if (element.itemId !== parseInt(params.query.itemId, 10)) {
        console.log(typeof element.itemId);
        console.log(typeof params.query.itemId);
        parts = [...parts, element];
      }
    });
    console.log(parts);
    perakitanResult = await perakitanService.update(
      perakitanResult.data[0]._id,
      {
        ...perakitanResult.data[0],
        parts,
      },
    );
    console.log(perakitanResult);
    let queryResult = perakitanResult;
    let partDataResult = [];
    let returnResult = {...queryResult};
    if (queryResult.parts.length > 0) {
      let catalogService = app.service('catalog');

      let {parts} = queryResult;

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
      returnResult = {...queryResult, parts: partDataResult};
    }

    return returnResult;
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;

// METHOD: GET
// PARAMS:
// RETURN: {perakitan}
// FUNCTION: Get simulation of logged in user, or make one if not available

// METHOD: POST
// DATA:
// PARAMS:
// RETURN: {perakitan}
// FUNCTION: Force system to replace current simulation from logged in user to a new one

// METHOD: PUT
// ID:
// DATA: {itemId,jumlah}
// PARAMS:
// RETURN: {perakitan}
// FUNCTION: Update selected parts in simulation section

// METHOD: PATCH
// ID:
// DATA: {pengiriman}
// PARAMS:
// RETURN: {perakitan}
// FUNCTION: Change status of simulation from simulasi to pembayaran, and make transaction record

// METHOD: REMOVE
// ID:
// PARAMS: {itemId}
// RETURN: {perakitan}
// FUNCTION: Remove a part from simulation selected parts
