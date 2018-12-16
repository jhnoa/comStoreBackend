// transaksi-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const transaksi = new Schema(
    {
      simulasiId: {type: String, required: true},
      userId: {type: String, required: true},
      totalPrice: {type: Number, required: true},
      pengiriman: {type: String, required: true}, // "ambil", dll
      status: {type: String, default: 'pembayaran'}, // pembayaran / selesai
    },
    {
      timestamps: true,
    },
  );

  return mongooseClient.model('transaksi', transaksi);
};
