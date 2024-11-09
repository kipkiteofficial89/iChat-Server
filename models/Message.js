const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
    msg: String,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reactions: {
        type: Array,
        default: [],
    }
})

const Message = mongoose.model('Message', msgSchema);
module.exports = Message;