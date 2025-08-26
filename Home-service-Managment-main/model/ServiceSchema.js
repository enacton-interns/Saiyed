//Service provider list will be store here 
// Book id , Name , skills , availability
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  //id of service provider
  //increment by 1
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  skills: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Service', ServiceSchema);