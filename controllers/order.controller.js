const Order = require("../models/order.model");
const csv=require('csvtojson')


exports.createOrder = (req, res, next)=>{

    let newOrder = new Order(req.body);
    

    newOrder.save().then((order)=>{


        if(order){
            res.status(201).json({
                message: "Order added successfully",
                order: {
                    order:order,
                    id: order._id
                }
            })
        }

    }).catch((e)=>{
        console.log("error",e)
    })

}

exports.uploadCsv = (req, res) => {
    let filePath= req.file.path
     importFile('../public' + '/excelUploads/' + req.file.filename);
         function importFile(){
           
             var arrayToInsert = [];
             csv().fromFile(filePath).then(source => {
           // Fetching the all data from each row
             for (var i = 0; i < source.length; i++) {
                 var singleRow = {
                    customerId: source[i]["customerId"],
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
                     if(result){
                         res.send({success: true, message:"file Uploaded successfully"})
                        //  res.redirect('/')
                     }
                 });
             });
    }
    // res.send("Single FIle upload success");
  };

  exports.template = async (req, res, next) => {
    
    const templateFileUrl = `${__dirname}/orderTemplate.csv`;
    res.download(templateFileUrl);
    
  }

  exports.getAll = (req, res, next) => {

    Order.find({}, (err, result) => {
        if(err) throw err;
        res.send({success: true,count:result.length,message:result})
    })
  }

