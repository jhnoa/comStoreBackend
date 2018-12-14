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
    let {all, removed, ...otherQuery} = params.query;

    let query =
      all === 'true'
        ? {removed: {$in: [true, false]}, ...otherQuery}
        : {removed: removed || false, ...otherQuery};
    console.log(query);
    let catalogService = app.service('catalog');
    let catalogResult = await catalogService.find({query});

    return catalogResult.data;
  }

  async create(data, params) {
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

    let catalogService = app.service('catalog');
    let catalogResult = await catalogService.find({
      query: {
        $limit: 1,
        $sort: {
          createdAt: -1,
        },
        $select: ['itemId'],
      },
    });
    let {name, casing, category, brand, price, picture} = data;
    catalogResult = await catalogService.create({
      itemId:
        ((catalogResult.data[0] && catalogResult.data[0].itemId) || 0) + 1,
      name,
      casing,
      category,
      brand,
      price,
      picture,
    });
    return catalogResult;
  }

  async update(id, data, params) {
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

    let {itemId, ...newData} = data;
    let catalogService = app.service('catalog');
    let catalogResult = await catalogService.find({query: {itemId}});

    if (catalogResult.total === 0) {
      const notFound = new errors.BadRequest({
        errors: 'No data found with that ID',
      });
      return notFound;
    }

    let {_id: catalogID, ...oldData} = catalogResult.data[0];
    catalogResult = await catalogService.update(catalogID, {
      ...oldData,
      ...newData,
    });

    return catalogResult;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
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

    let catalogService = app.service('catalog');
    let catalogResult = await catalogService.find({
      query: {
        itemId: id,
      },
    });
    if (catalogResult.total === 0) {
      const notFound = new errors.BadRequest({
        errors: 'No data found with that ID',
      });
      return notFound;
    }
    catalogResult = await catalogService.update(catalogResult.data[0]._id, {
      ...catalogResult.data[0],
      removed: true,
    });
    return {catalogResult};
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
