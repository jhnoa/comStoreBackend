const app = require('../../src/app');

describe('\'userData\' service', () => {
  it('registered the service', () => {
    const service = app.service('user-data');
    expect(service).toBeTruthy();
  });
});
