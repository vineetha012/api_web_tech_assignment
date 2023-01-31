const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customer_id: String,
    inventory_id: String,
    item_name: String,
    quantity: Number
});
const order_model = mongoose.model("orders", orderSchema);
module.exports = order_model;