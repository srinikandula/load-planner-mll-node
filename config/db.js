const mongoose = require('mongoose');
const config = require('../config/config');
  const connectDB = async () => {
   
    let mongoUrl = ''
    if (!config.mongo.host) {
        console.error("mongo host is missing");
    } else if (!config.mongo.port) {
        console.error("mongo port is missing");
    } else if (!config.mongo.database) {
        console.error("mongo database is missing");
    } else if (config.mongo.username && config.mongo.password) {
        mongoUrl = "mongodb://" + config.mongo.username + ":" + config.mongo.password + "@" + config.mongo.host + "/" + config.mongo.database
      
    } else {
        mongoUrl = "mongodb://" + config.mongo.host + "/" + config.mongo.database
        
    }
    // console.log('mongoUrl', mongoUrl)
     const conn = await mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log(`Mongo DB Connected : ${mongoUrl} `);
}

module.exports = connectDB;
