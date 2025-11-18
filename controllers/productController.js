import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';
import { timingSafeEqual } from 'crypto';
import { timeStamp } from 'console';
const addProduct = async (req, res) => {
  try {
    const {name , description , price , category , subcategory, sizes , bestsellers} = req.body;
    const image1 = req.files.image1 && req.files.image1[0]
    const image2 = req.files.image2 && req.files.image2[0]
    const image3 = req.files.image3 && req.files.image3[0]
    const image4 = req.files.image4 && req.files.image4[0]

    const images = [image1, image2, image3, image4].filter(img => img !== undefined);
      
    let imagesUrls = await Promise.all(
      images.map(async (image) => {
         let result = await cloudinary.uploader.upload(image.path , {resource_type: "image"});
         return result.secure_url;
      })
    )
   const product = new productModel( {
    name,
    description,
    category,
    price: Number(price),
    subcategory,
    bestsellers: bestsellers === "true" ? true : false,
    sizes: sizes ? sizes.split(",") : [],
     image: imagesUrls,
   }
   )

   await product.save();

  res.json({success: true , message: "product added successfully"})

  } catch (e) {
    console.error("ADD PRODUCT ERROR:", e); // Log the full error
    res.status(500).json({ success: false, message: e.message });
  }
};

//for list product
const listProduct = async (req, res) => {
  try{

    const products = await productModel.find({});
    res.json({success: true , products});



  }catch(error){
     console.error("LIST PRODUCT ERROR:", error); // Log the full error
     res.json({success: false , message: error.message});
  }
};

//for remove product
const removeProduct = async (req, res) => {
  try{
   
    await productModel.findByIdAndDelete(req.body.id);
    res.json({success: true , message: "product removed successfully"});


}catch(error){ 
  console.error("REMOVE PRODUCT ERROR:", error); 
     res.json({success: false , message: error.message});
 }

}

//for single product info
const singleProduct = async (req, res) => {
  try{
    const {productId} = req.body;
    const product = await productModel.findById(productId);
    res.json({success: true , product});

  }catch(error){
    console.error("SINGLE PRODUCT ERROR:", error); // Log the full error
     res.json({success: false , message: error.message});
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };
