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
    let {all, removed, $limit, ...otherQuery} = params.query;

    let query =
      all === 'true'
        ? {
          removed: {$in: [true, false]},
          ...otherQuery,
        }
        : {
          removed: removed || false,
          ...otherQuery,
        };
    let catalogService = app.service('catalog');
    let catalogResult = await catalogService.find({query});
    query = {...query, $limit: catalogResult.total};

    catalogResult = await catalogService.find({query});
    return catalogResult.data;
  }

  async get(id, params) {
    let {app} = this;
    let catalogService = app.service('catalog');
    let catalogResult = await catalogService.find({query: {itemId: id}});

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
        errors: 'User type mismatch',
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
    return catalogResult;
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;

// METHOD: GET
// PARAMS: {all=boolean} || {removed=boolean}
// RETURN: [{catalog}]
// FUNCTION: Get array of catalog items from list with determined 'removed' field

// METHOD: GET
// ID: {itemId}
// RETURN: {catalog}
// FUNCTION: Get item data from list with determined 'itemId' field

// METHOD: POST
// DATA: {name, casing, category, brand, price, picture}
// PARAMS:
// RETURN: {catalog}
// FUNCTION: Create new catalog item

// METHOD: PUT
// ID:
// DATA: {itemId, name, casing, category, brand, price, picture}
// PARAMS:
// RETURN: {catalog}
// FUNCTION: Make changes to catalog item with id itemId

// METHOD: REMOVE
// ID: itemId
// PARAMS:
// RETURN: {catalog}
// FUNCTION: Mark catalog item as removed, not really remove it
