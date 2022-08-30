const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        required: 'Email address is required...',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    username:{
        type:String,
        required:true,
        required:'username is required',
        unique:true,
    },
    companyName:{
        type:String,
        required:true,
        required:'companyName is required',
        unique:true,
    },
    customers:{
        type:Array,
        required:true,
        required:'customer required',
    },
    password:{
        type:String,
        required:true,
        required:'Password Required',
        // minlength : [4,'Password must be atleast 4 character long']
    }
})

let User = module.exports= mongoose.model('User',userSchema)

module.exports.getUserById=function(id,callback){
    User.findById(id,callback)
}

module.exports.getUserByUsername=function(username,callback){
    let query={username:username}

    User.findOne(query,callback)
}

module.exports.addUser=function(newUser,callback){
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err) throw err;
            newUser.password=hash;
            newUser.save(callback)
        })
    })
}

module.exports.comparePassword=function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
        if(err) throw err;
        callback(null,isMatch)
    })
}
