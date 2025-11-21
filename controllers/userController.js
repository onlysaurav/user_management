import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js"

class UserController {
	// Register User
	static userRegistration = async (req, res) => {
		const { name, email, password, password_confirmation, tc } = req.body
		const user = await UserModel.findOne({ email: email })
		// console.log(user)
		console.log(req.body)
		if (user) {
			res.send({ "status": "failed", "message": "email already exist" })
		} else {
			if (name && email && password && password_confirmation && tc) {
				if (password === password_confirmation) {
					try {
						const salt = await bcrypt.genSalt(10)
						const hashPassword = await bcrypt.hash(password, salt)
						const doc = await UserModel.create({
							name: name,
							email: email,
							password: hashPassword,
							tc: tc
						});
						res.send({ "status": "success", "message": "Registered Successfully !!.." })
					} catch (error) {
						console.log(error);
						res.send({ "status": "failed", "message": "Unable to register" })
					}
				} else {
					res.send({ "status": "failed", "message": "password and confirm_password does'nt match" })
				}
			} else {
				res.send({ "status": "failed", "message": "All fields are required" })
			}
		}
	}
// Login User
	static userLogin = async (req, res) => {
		try {
			const { email, password } = req.body
			if (email && password) {
				const user = await UserModel.findOne({ email: email })
				if (user != null) {
					const isMatch = await bcrypt.compare(password, user.password)
					if ((user.email === email) && isMatch) {
						// Generate JWT Token
						const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
						res.send({ "status": "success", "message": "Login Success", "token": token })
					} else {
						res.send({ "status": "failed", "message": "Email or Password is not Valid" })
					}
				} else {
					res.send({ "status": "failed", "message": "You are not a Registered User" })
				}
			} else {
				res.send({ "status": "failed", "message": "All Fields are Required" })
			}
		} catch (error) {
			console.log(error)
			res.send({ "status": "failed", "message": "Unable to Login" })
		}
	}
	// Forget Password Reset link on email
	static sendUserPasswordResetEmail = async (req, res) => {
		const { email } = req.body
		if (email) {
		  const user = await UserModel.findOne({ email: email })
		  if (user) {
			const secret = user._id + process.env.JWT_SECRET_KEY
			const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' })
			const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
			// console.log(link)
			// // Send Email
			let info = await transporter.sendMail({
			  from: process.env.EMAIL_FROM,
			  to: user.email,
			  subject: " Send by Saurabh's Organization - Password Reset Link",
			  html: `<a href=${link}>Click Here</a> to Reset Your Password`
			})
			res.send({ "status": "success", "message": "Password Reset Email Sent... Please Check Your Email" })
		  } else {
			res.send({ "status": "failed", "message": "Email doesn't exists" })
		  }
		} else {
		  res.send({ "status": "failed", "message": "Email Field is Required" })
		}
	  }
	  static userPasswordReset = async (req, res) => {
		const { password, password_confirmation } = req.body
		const { id, token } = req.params
		const user = await UserModel.findById(id)
		const new_secret = user._id + process.env.JWT_SECRET_KEY
		try {
		  jwt.verify(token, new_secret)
		  if (password && password_confirmation) {
			if (password !== password_confirmation) {
			  res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
			} else {
			  const salt = await bcrypt.genSalt(10)
			  const newHashPassword = await bcrypt.hash(password, salt)
			  await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
			  res.send({ "status": "success", "message": "Password Reset Successfully" })
			}
		  } else {
			res.send({ "status": "failed", "message": "All Fields are Required" })
		  }
		} catch (error) {
		  console.log(error)
		  res.send({ "status": "failed", "message": "Invalid Token" })
		}
	  }
}

export default UserController;