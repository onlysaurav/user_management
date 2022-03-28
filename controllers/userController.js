import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
class UserController {
    static userRegistration = async(req,res) => {
        const {name,email,password,password_confirmation,tc} = req.body
        const user = await UserModel.findOne({email:email})
        if(user){
            res.send({"status":"failed","message":"email already exist"})
        }else{
            if(name && email && password && password_confirmation && tc){
                if(password === password_confirmation){
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password, salt)
                        const doc = new UserModel({
                        name:name,
                        email:email,
                        password:hashPassword,
                        tc:tc
                    })
                    await doc.save
                    res.send({"status":"success","message":"Registered Successfully !!.."})    
                    } catch (error) {
                        console.log(error);
                        res.send({"status":"failed","message":"Unable to register"})
                    }
                }else{
                    res.send({"status":"failed","message":"password and confirm_password does'nt match"})
                }
            }else{
                res.send({"status":"failed","message":"All fields are required"})
            }
        }
    }
}

export default UserController;