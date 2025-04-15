const { string, required } = require("joi");
const mongoose =require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
const userSchema=new Schema({
    email:{
        type:String,
        required:true,         //other 2 fields like useername and password is already saved by localmongoose
    }
})
userSchema.plugin(passportLocalMongoose);    
module.exports = mongoose.model("User", userSchema);