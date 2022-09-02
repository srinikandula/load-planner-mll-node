const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const path = require('path')
const cors = require('cors')
const passport = require ('passport')
const users=require('./routes/users')
const orders=require('./routes/order.route')
const session = require('express-session');
require('dotenv').config()
const app = express()
const config = require('./config/config')
const connectDB = require('./config/db');


connectDB();

// mongoose.connect(process.env.MONGO_URI)

// mongoose.connection.on('connected',()=>{
//     console.log(`Database connected to ::: ${process.env.MONGO_URI}`)
// })
// mongoose.connection.on('error',(err)=>{
//     console.log(`Database error  ::: ${err}`)
// })


app.use(cors())

app.use(bodyParser.json())

app.use('/template', express.static('template'));

require('./middleware/passport')(passport);

app.use(session({ secret: config.jwt.secret }))

app.use(passport.initialize());

app.use(passport.session());

app.use(express.static(path.join(__dirname,'public')))

global.configuration = require('./config/config')

app.use('/api/v1/users',users)
app.use('/api/v1/orders',orders)

app.set('view engine','ejs')  

app.get('/',(req,res)=>{
    res.send('end point')
})

app.get('/p',(req,res)=>{
    res.render('Profile')
})


app.listen(config.PORT,()=>{
    console.log(`Server listening to ::: ${config.PORT}`)
})

