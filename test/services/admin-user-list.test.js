const app = require('../../src/app');

describe('\'admin-user-list\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin-user-list');
    expect(service).toBeTruthy();
  });
});
