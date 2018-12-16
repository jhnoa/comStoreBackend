// Initializes the `transaction` service on path `/transaction`
const createService = require('./transaction.class.js');
const hooks = require('./transaction.hooks');

module.exports = function(app) {
  const paginate = app.get('paginate');

  const options = {
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/transaction', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('transaction');

  service.hooks(hooks);
};
