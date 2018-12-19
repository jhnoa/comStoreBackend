const catalogSeeds = require('./catalogSeeds');
const usersSeeds = require('./usersSeeds');
const userDataSeeds = require('./userDataSeeds');
let seeder = async(app) => {
  let catalogService = app.service('catalog');
  let catalogResult = await catalogService.find({});
  if (catalogResult.total === 0) {
    console.log('Seeding Catalog');
    await catalogSeeds.forEach(async(element) => {
      await catalogService.create({...element});
    });
  }
  let usersService = app.service('users');
  let usersResult = await usersService.find({});
  if (usersResult.total === 0) {
    console.log('Seeding Users');
    await usersSeeds.forEach(async(element) => {
      await app
        .service('registration')
        .create({...element, ...userDataSeeds[usersSeeds.indexOf(element)]});
    });
  }
};

module.exports = seeder;
