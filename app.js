const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const path = require('path')
const cors = require('cors')
const passport = require ('passport')
const usersRoute=require('./routes/users.route')
const ordersRoute=require('./routes/order.route')
const session = require('express-session');
require('dotenv').config()
const app = express()
const config = require('./config/config')
const connectDB = require('./config/db');

connectDB();

app.use(cors())

app.use(bodyParser.json())

app.use('/template', express.static('template'));

require('./middlewares/passport')(passport);

app.use(session({ secret: config.jwt.secret }))

app.use(passport.initialize());

app.use(passport.session());

app.use(express.static(path.join(__dirname,'public')))

global.configuration = require('./config/config')

app.use('/api/v1/users',usersRoute)

app.use('/api/v1/orders',ordersRoute)

app.set('view engine','ejs')  

app.get('/',(req,res)=>{
    res.send('end point')
})

app.get('/p',(req,res)=>{
    res.render('Profile')
})


app.get("*", (req, res)=>{
    res.status(404).send({ error: "URL Not found..!" });
  });
app.post("*", (req, res)=>{
    res.status(404).send({ error: "URL Not found..!" });
  });


app.listen(config.PORT,()=>{
    console.log(`Server listening to ::: ${config.PORT}`)
})

