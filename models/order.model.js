const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNo: {
        type: Number
    },
    consignorName: {
        type: String
    },
    consigneeName: {
        type: String
    },
    consignorCity: {
        type: String
    },
    consigneeCity: {
        type: String
    },
    consignorState: {
        type: String
    },
    consigneeState: {
        type: String
    },
    weight: {
        type: String
    },
    orderDate: {
        type: Date
    },
    volumetricWeight: {
        type: String
    },
    volumeCFT: {
        type: String
    },
    etc: {
        type: Date
    },
    productName: {
        type: String
    },
    productQty: {
        type: Number
    },
    countOfCase: {
        type: Number
    },
    caseType: {
        type: String
    },
    orderStatus: {
        type: Boolean
    },
    proceedData: {
        type: Date
    },
    vehicleType: {
        type: String,
    },
    tripDate: {
        type: Date
    },
    tripTime: {
        type: Date
    },

    // consignmentNo: {
    //     type: Number,
    // },
    // consignorCity: {
    //     type: String,
    // },
    // consignorState: {
    //     type: String,
    // },
    // consigneeCity: {
    //     type: String,
    // },
    // consigneeState: {
    //     type: String,
    // },
    // volumeCft: {
    //     type: String,
    // },
    // weight: {
    //     type: String,
    // },
    // vehicleType: {
    //     type: String,
    // },
    // tripDate: {
    //     type: String
    // },
    // tripTime: {
    //     type: String
    // },
    // orderStatus: {
    //     type: String
    // },
    // proceedData: {
    //     type: Date
    // }
}, {timestamps: true});

let Order = module.exports = mongoose.model('Order', orderSchema, "order");
