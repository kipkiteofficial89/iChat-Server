const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    phone: String,
    about: String,
    profile: String,
    connected_peoples: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);
module.exports = User;