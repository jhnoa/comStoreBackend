const app = require('../../src/app');

describe('\'Perakitan\' service', () => {
  it('registered the service', () => {
    const service = app.service('perakitan');
    expect(service).toBeTruthy();
  });
});
