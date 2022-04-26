import express from "express";
const router = express.Router();
import UserController from "../controllers/userController.js";

//Public Routes
// router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)
router.post('/register', UserController.userRegistration)
router.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token',UserController.userPasswordReset)

export default router;
