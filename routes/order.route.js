const express=require('express')
const router=express.Router()
const {upload}= require('../services/fileUpload.service')
const OrderController=require('../controllers/order.controller')


router.post('/createOrder',OrderController.createOrder)
router.post("/uploadCsv",  upload.single("uploadCsv"),OrderController.uploadCsv);
router.get('/template',OrderController.template);
router.get('/getAllOrders',OrderController.getAll);
  
module.exports=router


