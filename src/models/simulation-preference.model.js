// simulation-preference-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const simulationPreference = new Schema(
    {
      description: {type: String, required: true},
      parts: {
        type: [
          {
            jumlah: {type: Number, required: true},
            itemId: {type: Number, required: true},
          },
        ],
        required: true,
      },
      picture: {type: String},
    },
    {
      timestamps: true,
    },
  );

  return mongooseClient.model('simulationPreference', simulationPreference);
};
