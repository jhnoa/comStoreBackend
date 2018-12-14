// Initializes the `userProfile` service on path `/user-profile`
const createService = require('./user-profile.class.js');
const hooks = require('./user-profile.hooks');

module.exports = function(app) {
  const paginate = app.get('paginate');

  const options = {
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/user-profile', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-profile');

  service.hooks(hooks);
};
