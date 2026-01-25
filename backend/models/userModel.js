const mongoose = require("mongoose");
require("dotenv");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique:true
  },
  image: {
    type: String,
  },
  preferredLang:{
    type:String,
    default:'en'
  }
});
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
