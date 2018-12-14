const app = require('../../src/app');

describe('\'simulasi\' service', () => {
  it('registered the service', () => {
    const service = app.service('simulasi');
    expect(service).toBeTruthy();
  });
});
