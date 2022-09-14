const Order = require("../models/order.model");
const plannedTrip = require("../models/plannedTrip.model");
const csv = require('csvtojson');
const path = require('path');
const { request } = require("http");
const { result } = require("@hapi/joi/lib/base");
const {error} = require("@hapi/joi/lib/annotate");
let mongoose = require('mongoose');
// let ObjectId = mongoose.Types.ObjectId;


exports.createOrder = (req, res, next) => {
    let newOrder = new Order(req.body);
    try {
        newOrder.save().then((order) => {
            if (order) {
                res.status(201).json({
                    message: "Order added successfully",
                    order: {
                        order: order,
                        id: order._id
                    }
                })
            }
        }).catch((e) => {
            console.log("error", e)
        })
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong" });
    }



}

exports.uploadLode = (req, res) => {
    try {
        return res({status: 200})
    } catch (err) {
        return err({status: 500})
    }
}

exports.uploadCsv = (req, res) => {
    try {
        let filePath = req.file.path
        importFile('./uploads' + req.file.filename);
        function importFile() {
            var arrayToInsert = [];
            csv().fromFile(filePath).then(source => {
                // Fetching the all data from each row
                for (var i = 0; i < source.length; i++) {
                    // console.log(source[i]);
                    var singleRow = {
                        // consignmentNo: source[i]["consignmentNo"],
                        // consignorCity: source[i]["consignorCity"],
                        // consignorState: source[i]["consignorState"],
                        // consigneeCity: source[i]["consigneeCity"],
                        // consigneeState: source[i]["consigneeState"],
                        // volumeCft: source[i]["volumeCft"],
                        // weight: source[i]["weight"],
                        orderNo: source[i]["OrderNo"],
                        consignorName: source[i]["ConsignorName"],
                        consigneeName: source[i]["ConsigneeName"],
                        consignorCity: source[i]["ConsignorCity"],
                        consigneeCity: source[i]["ConsigneeCity"],
                        consignorState: source[i]["ConsignorState"],
                        consigneeState: source[i]["ConsigneeState"],
                        weight: source[i]["Weight"],
                        orderDate: source[i]["OrderDate"],
                        volumetricWeight: source[i]["VolumetricWeight"],
                        volumeCFT: source[i]["VolumeCFT"],
                        etc: source[i]["ETA"],
                        productName: source[i]["ProductName"],
                        productQty: source[i]["ProductQty"],
                        countOfCase: source[i]["CountOfCase"],
                        caseType: source[i]["CaseType"],
                    };
                    arrayToInsert.push(singleRow);
                }
                Order.insertMany(arrayToInsert, (err, result) => {
                    if (err) console.log(err);
                    if (result) {
                        res.send({ status: 200, message: "file Uploaded successfully", data: result })
                    }
                });
            });
        }
    } catch (err) {
        res({ status: 500, message: "Something went wrong" });
    }
};

exports.orderTemplate = async (req, res, next) => {
    try {
        const templateFileUrl = `${configuration.baseUrl}/template/order/orderTemplate.csv`;
        if (templateFileUrl) {
            res({ status: 200, file: templateFileUrl })
        } else {
            res({ status: 400, message: "Template not found" })
        }
    } catch (err) {
        res({ status: 500, message: "Something went wrong" });
    }
}


exports.getAll = async (req, next) => {
    try {
        let query = Order.find({orderStatus: null});
        const page = req.body.page || 1;
        const pageSize = req.body.count || 10;
        const skip = (page - 1) * pageSize;
        const total = await Order.countDocuments({orderStatus: null});
        const pages = Math.ceil(total / pageSize);
        query = query.skip(skip).limit(pageSize);
        if (page > pages) {
            return next({status: 400, message: "No page found",});
        }
        const result = await query;
        return next({status: 200, count: result.length, page, pages, data: result, total});
    } catch (err) {
        next({ status: 500, message: "Something went wrong" });
    }
}

exports.orderProceedCon = async (req, next) => {
    try {
        if (req.body) {
            let dataSet = {
                orderIds: req.body.orderIds,
                vehicleType: req.body.vehicleType,
                tripDate: req.body.tripDate,
                tripTime: req.body.tripTime
            }
            let upDatedDataRes = await Order.updateMany({ '_id':{ $in : req.body.orderIds } }, {tripId: 'notExit'})
            let plannedTripDataRes = await plannedTrip.insertMany(dataSet)
            next({status: 200, orderData: upDatedDataRes, plannedTripData: plannedTripDataRes})
        }
    } catch (err) {
        return next({status: 500, message: err})
    }
}

exports.getAllPlannedTrips = async (req, next) => {
    try {
        let query = Order.find({orderStatus: 'planned_trip'});
        const page = req.body.page || 1;
        const pageSize = req.body.count || 10;
        const skip = (page - 1) * pageSize;
        const total = await Order.countDocuments({orderStatus: 'planned_trip'});
        const pages = Math.ceil(total / pageSize);
        query = query.skip(skip).limit(pageSize);
        if (page > pages) {
            return next({status: 400, message: "No page found",});
        }
        const result = await query;
        return next({status: 200, count: result.length, page, pages, data: result, total});
    } catch (err) {
        next({ status: 500, message: "Something went wrong" });
    }
}

exports.getAllUnPlannedTrips = async (req, next) => {
    try {
        let query = Order.find({orderStates: 'un_planned_trip'});
        const page = req.body.page || 1;
        const pageSize = req.body.count || 10;
        const skip = (page - 1) * pageSize;
        const total = await Order.countDocuments({orderStates: 'un_planned_trip'});
        const pages = Math.ceil(total / pageSize);
        query = query.skip(skip).limit(pageSize);
        if (page > pages) {
            return next({status: 400, message: "No page found",});
        }
        const result = await query;
        return next({status: 200, count: result.length, page, pages, data: result, total});
    } catch (err) {
        next({ success: 500, message: "Something went wrong" });
    }
}

