const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    name: {
        type: String,
      
        required: true,
       
      },
    rating: {
        type:Number,
        required: true,
    },
    comment: {
        type: String,
      
        required: true,
       
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
}, {timestamps:true})

const productSchema =new Schema(
    {
      name: { type: String, required: true },
      image: { type: [String] },
      author: {
        type: String,
        required: true,
      },
      
      sale: { type: Number },
   
      top:{
        type: Boolean,
        default: false,
      },
      quantity: { type: Number, required: true },
      category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
      description: { type: String, required: true },
      reviews: [reviewSchema],
      rating: { type: Number, required: true, default: 0 },
      numReviews: { type: Number, required: true, default: 0 },
      price: { type: Number, required: true, default: 0 },
      countInStock:{ type: Number, required: true, default: 0 },
      favourite: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );

  const Product = mongoose.model('Product', productSchema);

module.exports = Product;