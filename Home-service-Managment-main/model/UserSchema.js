// user id name contact addres service history which will be empty by default
const mongoose = require('mongoose');
//Service history  is an array of objects
//No authentication as of now
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  serviceHistory: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("User", UserSchema);