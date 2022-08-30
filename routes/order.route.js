const express=require('express')
const router=express.Router()
const  multer = require('multer');
const OrderController=require('../controllers/order.controller')

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public/excelUploads"); //important this is a direct path fron our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

router.post('/createOrder',OrderController.createOrder)
router.post("/uploadCsv",  upload.single("uploadCsv"),OrderController.uploadCsv);
router.get('/template',OrderController.template);
router.get('/getAllOrders',OrderController.getAll);
  
module.exports=router


