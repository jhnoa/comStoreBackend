const catalogSeeds = require('./catalogSeeds');
const usersSeeds = require('./usersSeeds');
const userDataSeeds = require('./userDataSeeds');
let seeder = async(app) => {
  let catalogService = app.service('catalog');
  let catalogResult = await catalogService.find({});
  if (catalogResult.total === 0) {
    console.log('Seeding Catalog');
    for (let index = 0; index < catalogSeeds.length; index++) {
      await catalogService.create({...catalogSeeds[index]});
    }
  }
  let usersService = app.service('users');
  let usersResult = await usersService.find({});
  if (usersResult.total === 0) {
    console.log('Seeding Users');
    for (let index = 0; index < usersSeeds.length; index++) {
      await app.service('registration').create({
        ...usersSeeds[index],
        ...userDataSeeds[index],
      });
    }
  }
};

module.exports = seeder;
