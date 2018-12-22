/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }
  async setup(app) {
    this.app = app;
  }
  async find(params) {
    let {app} = this;
    let simulationPreferenceService = app.service('simulation-preference');
    let simulationPreferenceResult = await simulationPreferenceService.find();
    let simulations = [];
    for (let i = 0; i < simulationPreferenceResult.data.length; i++) {
      const simulation = simulationPreferenceResult.data[i];
      let {parts} = simulation;
      let result = {...simulation};
      let resultParts = [];
      for (let j = 0; j < parts.length; j++) {
        const part = parts[j];
        let {itemId, jumlah} = part;
        let catalogService = app.service('catalog');
        let catalogResult = await catalogService.find({query: {itemId}});
        resultParts.push(catalogResult.data[0]);
      }
      console.log(resultParts);
      result = {...result, parts: resultParts};
      simulations.push(result);
    }
    return simulations;
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    let {app} = this;

    let {_id: userId} = params.user;
    let simulasiService = app.service('simulasi');
    let simulasiResult = await simulasiService.create({}, params);
    let {parts} = data;
    for (let index = 0; index < parts.length; index++) {
      const element = parts[index];
      let {itemId, jumlah} = element;
      simulasiResult = await simulasiService.update(
        simulasiResult._id,
        {itemId, jumlah},
        params,
      );
    }
    simulasiResult = await simulasiService.find(params);
    return simulasiResult;
  }

  async remove(id, params) {
    return {id};
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
