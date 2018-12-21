const app = require('../../src/app');

describe('\'simulation-preference\' service', () => {
  it('registered the service', () => {
    const service = app.service('simulation-preference');
    expect(service).toBeTruthy();
  });
});
