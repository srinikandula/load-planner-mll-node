const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const path = require('path')
const cors = require('cors')
const passport = require ('passport')
const users=require('./routes/users')
const session = require('express-session');
require('dotenv').config()
const app = express()


mongoose.connect(process.env.MONGO_URI)

mongoose.connection.on('connected',()=>{
    console.log(`Database connected to ::: ${process.env.MONGO_URI}`)
})
mongoose.connection.on('error',(err)=>{
    console.log(`Database error  ::: ${err}`)
})

app.use(cors())

app.use(bodyParser.json())

require('./middleware/passport')(passport);

app.use(session({ secret: process.env.secret }))

app.use(passport.initialize());

app.use(passport.session());

app.use(express.static(path.join(__dirname,'public')))

app.use('/api/v1/users',users)

app.get('/',(req,res)=>{
    res.send('end point')
})

app.listen(process.env.PORT,()=>{
    console.log(`Server listening to ::: ${process.env.PORT}`)
})

