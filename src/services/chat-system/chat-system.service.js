// Initializes the `chatSystem` service on path `/chat-system`
const createService = require('./chat-system.class.js');
const hooks = require('./chat-system.hooks');

module.exports = function(app) {

  const paginate = app.get('paginate');

  const options = {
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/chat-system', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('chat-system');

  service.hooks(hooks);
};
