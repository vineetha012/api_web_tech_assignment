const express = require("express");
const mongoose = require("mongoose");
const customer=require('./models/customertableModel')
const inventories=require('./models/inventorytableModel')
const orders=require('./models/ordertableModel')

const bodyParser = require("body-parser");
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
mongoose.connect("mongodb://localhost/api_web_tech_assignments",()=>console.log("mongoose is connected"));

//sample checking 
app.get("/", async (req, res) => {
    res.send("Hello world");
});
//1 - post - /createOrders
app.post('/createOrders',async(req,res)=>{
    try {
        let { customer_id,inventory_id,item_name,quantity}=req.body
        let inventoryexist=await inventories.findOne({inventory_id:inventory_id})
        let customerexist=await customer.findOne({customer_id:customer_id})
        if(inventoryexist&&customerexist){

            let available_quantity=inventoryexist.available_quantity
            let remaining_quantity=available_quantity-quantity
            console.log("remaining_quantity",remaining_quantity)
            if(available_quantity>=quantity){
                const newOrder=await orders.create(req.body)
                const updateinventories=await inventories.findOneAndUpdate({inventory_id:inventory_id},{available_quantity:remaining_quantity})
                return res.json({
                    status:"success",
                    message:"order is created  and updated the available items in the inventories",
                    newOrder
                })
            }else if(available_quantity==0){
                res.json({
                    status:"failed",
                    message:"ITEM IS OUT OF STOCK"
                })
            }
            else{
                res.json({
                    status:"failed",
                    message:"ITEM IS OUT OF STOCK"
                })
            }

        }else{
            res.json({
                status:"failed",
                message:"give a valid customer id and product id"
            })
        }
       
    } catch (error) {
        return res.json({
            status:"failed",
            message:error.message
        })
    }
})

//2 - post - /createInventory
app.post('/createInventory',async(req,res)=>{
    try {
        console.log(req.body);
        //console.log(req.body)
        await inventories.create(req.body);
        res.json({ 
            status:"success",
            message: "new item is created" 
        });
    } catch (error) {
        return res.json({
            status:"failed",
            message:error.message
        })
    }
})

//3 - post -  /createCustomer
app.post('/createCustomer',async(req,res)=>{
    try {
        console.log(req.body);
        const newcustomer=await customer.create(req.body);
        res.json({
            status: "success",
            message:  " new Customer is created",
            newcustomer
        });
    } catch (error) {
        res.json({
            status:"failed",
            message:error.message
        })
    }
})
//1 - get - /orders
app.get('/orders',async(req,res)=>{
    try {
        const allorders=await orders.find()
        return res.json({
            status:"success",
            allorders
        })
    } catch (error) {
        res.json({
            status:"failed",
            message:error.message
        })
    }
})
//2 - get - /inventory
app.get('/inventory',async(req,res)=>{
    try {
        const allInventories=await inventories.find()
        return res.json({
            status:"success",
            allInventories
        })
    } catch (error) {
        res.json({
            status:"failed",
            message:error.message
        })
    }
})
//3 - get - /customerDetails

app.get('/customerDetails',async(req,res)=>{
    try {
        const allCustomers=await customer.find()
        return res.json({
            status:"success",
            allCustomers
        })
    } catch (error) {
        res.json({
            status:"failed",
            message:error.message
        })
    }
})
//4 - get - /inventory/inventoryType
app.get('/inventory/:inventoryType',async(req,res)=>{
    try {
        let inventory_Type=req.params.inventoryType
        const results=await inventories.find({inventory_type:inventory_Type})
        res.json({
            status:"success",
            message:"",
            results
        })
    } catch (error) {
        res.json({
            status:"failed",
            message:error.message
        })
    }
})
//1 - put - /itemName/availableQuantity---Api for updating the available quantity
app.put('/itemName/availableQuantity',async(req,res)=>{
    try {
        let item_name=req.body.item_name
        let available_quantity=req.body.available_quantity
        const updatedItem=await inventories.findOneAndUpdate({item_name:item_name},{available_quantity:available_quantity})
        if(updatedItem){
            console.log(updatedItem)
            res.json({
                status:"success",
                updatedItem
            })
        }
        
    } catch (error) {
        res.json({
            status:"failed",
            message:error.message
        })
    }
})
//----------additional endpoints-------


//get a particular customer
app.get('/customer/:customerId',async(req,res)=>{
    try {
        let  customerId=req.params.customerId
        const customer_result=await customer.findOne({customer_id:customerId})
        res.json({
            customer_result
        })
    } catch (error) {
        res.json({
            status:"failed",
            message:error.message
        })
    }
})

//get a particular product
app.get('/inventories/:inventoryId',async(req,res)=>{
    try {
        let  inventoryId=parseInt(req.params.inventoryId)
        const inventory_result=await inventories.findOne({inventory_id:inventoryId})
        res.json({
            inventory_result
        })
    } catch (error) {
        res.json({
            status:"failed",
            message:error.message
        })
    }
})
//get a particular order
app.get('/orders/:orderId',async(req,res)=>{
    try {
        let  orderId=req.params.orderId
        const order_result=await orders.findOne({_id:orderId})
        res.json({
            order_result
        })
    } catch (error) {
        res.json({
            status:"failed",
            message:error.message
        })
    }
})

app.listen(3005, () => console.log("server is running at port 3005...."));
