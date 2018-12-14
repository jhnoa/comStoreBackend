// Initializes the `item-list` service on path `/item-list`
const createService = require('./item-list.class.js');
const hooks = require('./item-list.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/item-list', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('item-list');

  service.hooks(hooks);
};
