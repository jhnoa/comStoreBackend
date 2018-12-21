const catalogSeeds = require('./catalogSeeds');
const usersSeeds = require('./usersSeeds');
const userDataSeeds = require('./userDataSeeds');
const simulationPreferenceSeeds = require('./simulationTemplateSeeds');
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
  let simulationPreferenceService = app.service('simulation-preference');
  let simulationPreferenceResult = await simulationPreferenceService.find({});
  if (simulationPreferenceResult.total === 0) {
    console.log('Seeding Simulation Preference');
    for (let index = 0; index < simulationPreferenceSeeds.length; index++) {
      await simulationPreferenceService.create({
        ...simulationPreferenceSeeds[index],
      });
    }
  }
};

module.exports = seeder;
