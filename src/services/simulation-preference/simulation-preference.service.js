// Initializes the `simulation-preference` service on path `/simulation-preference`
const createService = require('feathers-mongoose');
const createModel = require('../../models/simulation-preference.model');
const hooks = require('./simulation-preference.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/simulation-preference', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('simulation-preference');

  service.hooks(hooks);
};
