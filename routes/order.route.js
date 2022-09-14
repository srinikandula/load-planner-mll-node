const express = require('express')
const router = express.Router()
const {upload} = require('../services/fileUpload.service')
const OrderController = require('../controllers/order.controller')


router.post('/createOrder', OrderController.createOrder)
router.get('/uploadCsvLoad', (req, res) => {
    OrderController.uploadLode(req, result => {
        res.status(result.status).json(result)
    })
});
// router.post('/uploadCsv', upload.single("uploadCsv"), OrderController.uploadCsv);
router.post('/uploadCsv', upload.single("uploadCsv"), (req, res) => {
    OrderController.uploadCsv(req, result => {
        res.status(result.status).json(result)
    })
});
// router.get('/template', OrderController.orderTemplate);
router.get('/orderTemplate', (req, res) => {
    OrderController.orderTemplate(req, result => {
        res.status(result.status).json(result)
    })
});
router.post('/getAllOrders', (req, res) => {
    OrderController.getAll(req, result => {
        res.status(result.status).json(result)
    })
});

router.post('/orderProceed', (req, res) => {
    OrderController.orderProceedCon(req, result => {
        res.status(result.status).json(result)
    })
})

router.post('/plannedTrips', (req, res) => {
    OrderController.getAllPlannedTrips(req, result => {
        res.status(result.status).json(result)
    })
})

router.post('/unPlannedTrips', (req, res) => {
    OrderController.getAllUnPlannedTrips(req, result => {
        res.status(result.status).json(result)
    })
})

module.exports = router


