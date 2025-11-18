import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator"



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

     password: {  
        type: String,
        required: true,
    },
     cartData: {
        type: Object,
       default: {},
    },
}, ({minimize: false})); // Disable minimize to keep empty objects

  userSchema.methods.getjwt = async function () {
    const user = this;
    const token = await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return token;
};

userSchema.methods.isValidatePasssword = async function (userEnterPassword) {
    const user = this;
    const isPassword = await bcrypt.compare(userEnterPassword , this.password)
    return isPassword
}

   
const userModel =  mongoose.models.user || mongoose.model("user", userSchema);



export default userModel;