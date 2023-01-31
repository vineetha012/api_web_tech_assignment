const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    customer_id:{type:Number,required:true,unique:true},
    customer_name: {type:String,required:true},
    email: {type:String,required:true,unique:true}
});

const customer_model = mongoose.model("customers", customerSchema);

module.exports = customer_model;