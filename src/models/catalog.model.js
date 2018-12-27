// catalog-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const catalog = new Schema(
    {
      itemId: {type: Number, required: true},
      name: {type: String, required: true},
      casing: {type: String, required: true},
      category: {type: String, required: true},
      brand: {type: String, required: true},
      price: {type: Number, required: true},
      picture: {type: String},
      removed: {type: Boolean, default: false},
    },
    {
      timestamps: true,
    },
  );

  return mongooseClient.model('catalog', catalog);
};
