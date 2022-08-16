const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id:String,
 title: String,
  note: String,
 label: String,
});

const UserModel = mongoose.model("note", userSchema);

module.exports = UserModel;
