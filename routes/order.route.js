const express = require('express')
const router = express.Router()
const {upload} = require('../services/fileUpload.service')
const OrderController = require('../controllers/order.controller')


router.post('/createOrder', OrderController.createOrder)
router.post('/uploadCsv', upload.single("uploadCsv"), OrderController.uploadCsv);
router.get('/template', OrderController.template);
router.post('/getAllOrders', (req, res) => {
    OrderController.getAll(req, result => {
        if (result.status == 'success') {
            res.status(200).json(result)
        } else {
            res.status(400).json(result)
        }
    })
});

router.post('/orderProceed', (req, res) => {
    OrderController.orderProceedCon(req, result => {
        if (result.status == 'success') {
            res.status(200).json(result)
        } else {
            res.status(400).json(result)
        }
    })
})

router.post('/plannedTrips', (req, res) => {
    OrderController.getAllPlannedTrips(req, result => {
        if (result.status == 'success') {
            res.status(200).json(result)
        } else {
            res.status(400).json(result)
        }
    })
})

router.post('/unPlannedTrips', (req, res) => {
    OrderController.getAllUnPlannedTrips(req, result => {
        if (result.status == 'success') {
            res.status(200).json(result)
        } else {
            res.status(400).json(result)
        }
    })
})

module.exports = router


