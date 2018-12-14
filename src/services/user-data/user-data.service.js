// Initializes the `userData` service on path `/user-data`
const createService = require('feathers-mongoose');
const createModel = require('../../models/user-data.model');
const hooks = require('./user-data.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/user-data', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-data');

  service.hooks(hooks);
};
