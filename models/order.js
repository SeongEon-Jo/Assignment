const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  comment: {
    type: String,
  }
}, {timestamps: true });

const OrderList = mongoose.model('OrderList', orderSchema);
module.exports = OrderList;