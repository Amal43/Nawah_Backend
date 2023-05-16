const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const engineerSchema = new Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return value && value.length >= 6;
      },
      message: 'Password must be at least 6 characters long'
    }
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  img:{
    type:String,
    required: true,
    default: "http://localhost:5000/default.png",
  },
  license:{
    type:[String],
    required: true,
  },

});

const Engineer = mongoose.model('engineers', engineerSchema);

module.exports = Engineer;