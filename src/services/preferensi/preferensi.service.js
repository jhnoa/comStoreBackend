// Initializes the `preferensi` service on path `/preferensi`
const createService = require('./preferensi.class.js');
const hooks = require('./preferensi.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/preferensi', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('preferensi');

  service.hooks(hooks);
};
