const app = require('../../src/app');

describe('\'catalog\' service', () => {
  it('registered the service', () => {
    const service = app.service('catalog');
    expect(service).toBeTruthy();
  });
});
