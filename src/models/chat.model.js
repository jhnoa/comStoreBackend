// chat-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const chat = new Schema(
    {
      userId: {type: String, required: true},
      data: [{sender: String, message: String, timeStamp: Number}],
    },
    {timestamps: true},
  );

  return mongooseClient.model('chat', chat);
};
