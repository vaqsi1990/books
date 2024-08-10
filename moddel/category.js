const mongoose = require('mongoose');
const { Schema } = mongoose;
const categorySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
    unique: true,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;