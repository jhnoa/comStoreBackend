// Initializes the `simulasi` service on path `/simulasi`
const createService = require('./simulasi.class.js');
const hooks = require('./simulasi.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/simulasi', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('simulasi');

  service.hooks(hooks);
};
