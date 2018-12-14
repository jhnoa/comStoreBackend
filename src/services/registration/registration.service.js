// Initializes the `registration` service on path `/registration`
const createService = require('./registration.class.js');
const hooks = require('./registration.hooks');

module.exports = function(app) {
  const paginate = app.get('paginate');

  const options = {
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/registration', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('registration');

  service.hooks(hooks);
};
