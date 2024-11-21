const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.joinUser = async (req, res) => {
    try {
        const findUser = await User.findOne({ username: req.body.username });
        if (findUser) {
            const token = jwt.sign(
                {
                    username: findUser.username,
                    userId: findUser._id
                },
                process.env.SECRET_KEY,
                { expiresIn: '7d' }
            )
            res.status(200).json({
                msg: 'Welcome back to iChat.',
                user: findUser,
                token
            })
        } else {
            const user = new User(req.body);
            await user.save().then((usr) => {
                const token = jwt.sign(
                    {
                        username: usr.username,
                        userId: usr._id
                    },
                    process.env.SECRET_KEY,
                    { expiresIn: '7d' }
                )
                res.status(200).json({
                    msg: 'Joined successfully.',
                    user: usr,
                    token
                })
            }).catch((err) => {
                res.status(400).json({
                    msg: 'Something went to wrong when joining to iChat',
                    err
                })
                console.log(err);
            })
        }
    } catch (err) {
        console.log(err);
    }
}

exports.getUser = async (req, res) => {
    try {
        const findUser = await User.findOne({ _id: req.userId });
        res.status(200).json({
            user: findUser
        })
    } catch (err) {
        console.log(err);
    }
}

exports.searchPeople = async (req, res) => {
    try {
        const { value } = req.query;
        if (value === "") {
            res.status(200).json({
                connected_peoples: []
            })
        } else {
            const reg = new RegExp(value.trim(), 'i');
            const SP = await User.find({
                $or: [
                    { name: { $regex: reg } },
                    { username: { $regex: reg } }
                ]
            })
            res.status(200).json({
                connected_peoples: SP
            })
        }
    } catch (err) {
        console.log(err);
    }
}

exports.getUserInfo = async (req, res) => {
    try {
        const { userId } = req.query;
        const findUser = await User.findById(userId);
        res.status(200).json({
            msg: 'User fetched successfully!',
            usr: findUser
        })
    } catch (err) {
        console.log(err);
    }
}

exports.fetchConnectedPeoples = async (req, res) => {
    try {
        const { userId } = req;
        const peoples = await User.findById(userId, { _id: 0, name: 0, username: 0, email: 0, phone: 0, about: 0, profile: 0, __v: 0 }).populate({
            path: 'connected_peoples',
            select: '-connected_peoples'
        })
        res.status(200).json(peoples);
    } catch (err) {
        console.log(err);
    }
}