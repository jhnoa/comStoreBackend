// Initializes the `admin-user-list` service on path `/admin-user-list`
const createService = require('./admin-user-list.class.js');
const hooks = require('./admin-user-list.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/admin-user-list', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin-user-list');

  service.hooks(hooks);
};
