const mongoose = require('mongoose');

const mainserSchema = new mongoose.Schema({

  services:{
    type: String
  },
  windo_no:[{
    type: Number
  }],
  count:{
    type: Number,
    default:1
  }


 });

const mainser = mongoose.model('Mainser',mainserSchema);
module.exports = mainser;