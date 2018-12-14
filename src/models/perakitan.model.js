// Perakitan-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const perakitan = new Schema(
    {
      userId: {
        type: String,
        required: true,
      },
      parts: {
        type: [
          {
            itemId: {
              type: Number,
              required: true,
            },
            jumlah: {
              type: Number,
              required: true,
            },
          },
        ],
        default: [],
      },
      status: {
        type: String, // simulasi / pembayaran / perakitan / selesai
        default: 'simulasi',
      },
    },
    {
      timestamps: true,
    },
  );

  return mongooseClient.model('perakitan', perakitan);
};
