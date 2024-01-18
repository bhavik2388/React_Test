const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  name: { type: String },
  number: { type: String },
  age: { type: Number },
});

const User = model('User', userSchema);

module.exports = User;
