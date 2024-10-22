const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  UserName: { type: String, required: true ,unique: true},
  Email: { type: String, required: true, unique:true },
  RollNumber: { type: String, required: true, unique:true },
  RoomNumber: { type: Number, required: true },
  PhoneNumber: { type: Number, required: true, unique:true },
  Password: { type: String, required: true },
});

const User = mongoose.model('user', userSchema);
module.exports = User;
