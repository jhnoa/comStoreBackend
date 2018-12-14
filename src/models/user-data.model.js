// userData-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const userData = new Schema(
    {
      userID: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      contactNumber: {
        type: String,
        required: true,
      },
      type: {
        type: String, // admin / customer
        required: true,
      },
    },
    {
      timestamps: true,
    },
  );

  return mongooseClient.model('userData', userData);
};
