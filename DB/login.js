const mongoose = require('mongoose');
const loginSchema=new mongoose.Schema({
    phone:Number,
    username:String,
        password:String,
       
})
module.exports = mongoose.model('Login', loginSchema)