import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  sizes: {
    type: [String],
    required: true,
  },
  bestsellers: {
    type: Boolean,
  },
 
} ,{
    timestamps : true,
   });

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
