const Order = require("../models/order.model");
const csv = require('csvtojson');
const path = require('path');
const { request } = require("http");
const { result } = require("@hapi/joi/lib/base");


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

exports.uploadCsv = (req, res) => {

    try {
        let filePath = req.file.path
        importFile('./uploads' + req.file.filename);
        function importFile() {

            var arrayToInsert = [];
            csv().fromFile(filePath).then(source => {
                // Fetching the all data from each row
                for (var i = 0; i < source.length; i++) {
                    var singleRow = {
                        consignmentNo: source[i]["consignmentNo"],
                        consignorCity: source[i]["consignorCity"],
                        consignorState: source[i]["consignorState"],
                        consigneeCity: source[i]["consigneeCity"],
                        consigneeState: source[i]["consigneeState"],
                        volumeCft: source[i]["volumeCft"],
                        weight: source[i]["weight"],
                    };
                    arrayToInsert.push(singleRow);
                }
                //inserting into the table orders
                Order.insertMany(arrayToInsert, (err, result) => {
                    if (err) console.log(err);
                    if (result) {
                        res.send({ success: true, message: "file Uploaded successfully", data: result })
                        //  res.redirect('/')
                    }
                });
            });
        }
        // res.send("Single FIle upload success");
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

exports.template = async (req, res, next) => {

    try {
        const templateFileUrl = `${configuration.baseUrl}/template/order/orderTemplate.csv`;
        if (templateFileUrl) {
            res.status(200).send({ success: true, file: templateFileUrl })
        } else {
            res.status(404).send({ success: false, message: "Template not found" })
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}


exports.getAll = async (req, res, next) => {

    try {
        let query = Order.find({});
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * pageSize;
        const total = await Order.countDocuments();
        const pages = Math.ceil(total / pageSize);

        query = query.skip(skip).limit(pageSize);
        if (page > pages) {
            return res.status(404).json({
                status: "fail",
                message: "No page found",
            });
        }

        const result = await query;

        res.status(200).json({
            status: "success",
            count: result.length,
            page,
            pages,
            data: result,
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

