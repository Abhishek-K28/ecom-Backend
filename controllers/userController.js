import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

//route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (name.length < 4) {
      return res.send("name length should be 4 or more ");
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists please login" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }
    if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json({
          message:
            "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol",
        });
    }

    const passwordhash = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: passwordhash,
    });

    const registeredUser = await user.save();

    const token = await registeredUser.getjwt();
    res.cookie("token", token);

    res.json({
      data: registeredUser,
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ message: error.message });
  }
};

//route for user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ message: "User does not exist please register" });
  }

  const isPassword = await user.isValidatePasssword(password);
  if (!isPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const Alreadylogin = req.cookies.token;
  if (Alreadylogin) {
    return res.status(400).json({ message: "User already logged in" });
  }

  const token = await user.getjwt();
  res.cookie("token", token);
  res.json({
    data: user,
  });
};

// route for admin login
const adminLogin = async (req, res) => {
 try{

 const {email , password} = req.body;
 if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
  const token = await jwt.sign({ email: email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
});
  res.cookie("token" , token);
  res.json({success: true , message: "admin logged in successfully" , token})
 }else{
  res.json({success: false , message: "invalid admin credentials"})
 }

 }catch(error){
    console.error("ADMIN LOGIN ERROR:", error);
 }

};

export { registerUser, loginUser, adminLogin };
