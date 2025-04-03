import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../modules/message.model.js";
import User from "../modules/user.model.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filterUsers = await User.find({ _id: { $nin: loggedInUserId } }).select("-password");
        res.status(200).json(filterUsers);

    } catch (error) {
        console.log("Error In getUserForSidebar Controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId, },
                { senderId: userToChatId, receiverId: myId }

            ]
        })
        res.status(200).json(messages);

    } catch (error) {
        console.log("Error In getMessages Controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: `messages/${senderId}` // Store in a folder named after the user's ID
            });
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        await newMessage.save();

        // real time functionality => socket.io
        const reciverSocketId = getReceiverSocketId(receiverId)
        if(reciverSocketId){
             io.to(reciverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error In getMessages Controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}