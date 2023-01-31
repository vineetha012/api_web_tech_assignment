const mongoose=require('mongoose')
const inventorySchema=new mongoose.Schema({
    inventory_id:{type:Number,required:true,unique:true},
    inventory_type:{type:String,required:true},
    item_name:{type:String,required:true},
    available_quantity:{type:Number,required:true}
})
const inventory_model = mongoose.model("Inventory", inventorySchema);
module.exports=inventory_model