const mongoose = require("mongoose")
require("dotenv");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },image:{
        type:String
    }
})
const UserModel = mongoose.model('social-logins',UserSchema)
module.exports=UserModel;