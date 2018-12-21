const app = require('../../src/app');

describe('\'preferensi\' service', () => {
  it('registered the service', () => {
    const service = app.service('preferensi');
    expect(service).toBeTruthy();
  });
});
