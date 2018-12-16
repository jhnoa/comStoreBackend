const users = require('./users/users.service.js');
const catalog = require('./catalog/catalog.service.js');
const chat = require('./chat/chat.service.js');
const chatSystem = require('./chat-system/chat-system.service.js');
const perakitan = require('./perakitan/perakitan.service.js');
const userData = require('./user-data/user-data.service.js');
const transaksi = require('./transaksi/transaksi.service.js');
const registration = require('./registration/registration.service.js');
const userProfile = require('./user-profile/user-profile.service.js');
const itemList = require('./item-list/item-list.service.js');
const simulasi = require('./simulasi/simulasi.service.js');
const transaction = require('./transaction/transaction.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(users);
  app.configure(catalog);
  app.configure(chat);
  app.configure(chatSystem);
  app.configure(perakitan);
  app.configure(userData);
  app.configure(transaksi);
  app.configure(registration);
  app.configure(userProfile);
  app.configure(itemList);
  app.configure(simulasi);
  app.configure(transaction);
};
