// Initializes the `transaksi` service on path `/transaksi`
const createService = require('feathers-mongoose');
const createModel = require('../../models/transaksi.model');
const hooks = require('./transaksi.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/transaksi', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('transaksi');

  service.hooks(hooks);
};
