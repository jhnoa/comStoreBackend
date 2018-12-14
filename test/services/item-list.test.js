const app = require('../../src/app');

describe('\'item-list\' service', () => {
  it('registered the service', () => {
    const service = app.service('item-list');
    expect(service).toBeTruthy();
  });
});
