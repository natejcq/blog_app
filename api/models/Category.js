const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CategorySchema = new Schema({
  name: String, // Name of the category
});

const CategoryModel = model('Category', CategorySchema);
module.exports = CategoryModel;
