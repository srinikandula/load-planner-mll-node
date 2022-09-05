const mongoose=require('mongoose');


const orderSchema=new mongoose.Schema({
    consignmentNo:{
        type:Number,
    },
    consignorCity:{
        type:String,
    },
    consignorState:{
        type:String,
    },
    consigneeCity:{
        type:String,
    },
    consigneeState:{
        type:String,
    },
    volumeCft:{
        type:Number,
    },
    weight:{
        type:Number,
    },
   
},{timestamps:true});

let Order = module.exports = mongoose.model('Order', orderSchema);