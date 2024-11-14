const Message = require('../models/Message');

exports.getConversation = async (req, res) => {
    try {
        const { receiverId } = req.query;
        const { userId } = req;
        const findChats = await Message.find({
            $or: [
                { sender: userId, receiver: receiverId },
                { sender: receiverId, receiver: userId }
            ]
        });
        res.status(200).json(findChats);
    } catch (err) {
        console.log(err);
    }
}