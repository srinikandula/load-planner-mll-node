const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    consignmentNo: {
        type: Number,
    },
    consignorCity: {
        type: String,
    },
    consignorState: {
        type: String,
    },
    consigneeCity: {
        type: String,
    },
    consigneeState: {
        type: String,
    },
    volumeCft: {
        type: String,
    },
    weight: {
        type: String,
    },
    vehicleType: {
        type: String,
    },
    tripDate: {
        type: String
    },
    tripTime: {
        type: String
    },
    orderStatus: {
        type: String
    },
    proceedData: {
        type: Date
    }
}, {timestamps: true});

let Order = module.exports = mongoose.model('Order', orderSchema, "order");
