import cloudinary from "../lib/cloudinary.js";
import { genrateToken } from "../lib/utils.js";
import User from "../modules/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }
        const emailExist = await User.findOne({ email })
        if (emailExist) {
            return res.status(400).json({ message: "Email already exist" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashPassword
        })
        if (newUser) {
            // generate jwt token
            genrateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })

        } else {
            res.status(400).json({ message: "Invalid user data" })
        }

    } catch (error) {
        console.log("Error In Signup Controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })

    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExist = await User.findOne({ email })
        if (!userExist) {
            return res.status(404).json({ message: "Invalid credentials" })
        }
        const passwordCheck = await bcrypt.compare(password, userExist.password)
        if (!passwordCheck) {
            return res.status(404).json({ message: "Invalid credentials" })
        }
        genrateToken(userExist._id, res)
        res.status(200).json({
            _id: userExist._id,
            fullName: userExist.fullName,
            email: userExist.email,
            profilePic: userExist.profilePic,
        })
    } catch (error) {
        console.log("Error In Login Controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Error In Logout Controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            res.status(400).json({ message: "Profile pic is required" })
        }
        // Upload the profile picture to a folder with the user's ID
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: `profile_pictures/${userId}`, // Store in a folder named after the userId
        });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url }, // Update the user's profilePic with the Cloudinary URL
            { new: true }
        );
        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("Error In Update Profile Controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
};

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    }
    catch (error) {
        console.log("Error in checkAuth controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}