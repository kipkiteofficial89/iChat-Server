const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
    genc_id: String,
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
}, { timestamps: true });

const Message = mongoose.model('Message', msgSchema);
module.exports = Message;