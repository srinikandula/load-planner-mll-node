const mongoose = require('mongoose');


const plannedTripSchema = new mongoose.Schema({
    orderIds: {
        type: Array,
    },
    vehicleType: {
        type: String
    },
    tripDate: {
        type: String
    },
    tripTime: {
        type: String
    },
}, {timestamps: true});

let plannedTrip = module.exports = mongoose.model('plannedTrip', plannedTripSchema, 'plannedTrip');
