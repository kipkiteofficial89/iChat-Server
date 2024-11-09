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