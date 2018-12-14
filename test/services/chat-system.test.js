const app = require('../../src/app');

describe('\'chatSystem\' service', () => {
  it('registered the service', () => {
    const service = app.service('chat-system');
    expect(service).toBeTruthy();
  });
});
