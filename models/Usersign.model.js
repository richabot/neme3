const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  age: Number,
});

const Usersignmodel = mongoose.model("user", userSchema);

module.exports = Usersignmodel;