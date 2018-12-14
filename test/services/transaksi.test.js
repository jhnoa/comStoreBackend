const app = require('../../src/app');

describe('\'transaksi\' service', () => {
  it('registered the service', () => {
    const service = app.service('transaksi');
    expect(service).toBeTruthy();
  });
});
