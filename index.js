require('dotenv').config();
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messagesRoutes');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Someone connected!');
    io.emit('someoneConnected', 'A new user connected.');

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
    })

    socket.on('sendMessage', async (data) => {
        const { roomId, genc_id, msg, sender, receiver } = data;
        const message = {
            genc_id,
            msg,
            sender,
            receiver,
            reactions: []
        }
        await User.findByIdAndUpdate(sender, { $addToSet: { connected_peoples: receiver } }, { new: true })
        await User.findByIdAndUpdate(receiver, { $addToSet: { connected_peoples: sender } }, { new: true })
        new Message(message).save();
        io.to(roomId).emit('sendFromServer', message);
    })

    socket.on('react', async (data) => {
        const { roomId, userId, genc_id, name, profile, react } = data;
        const reaction = { userId, name, profile, react, genc_id };

        await Message.findOneAndUpdate({
            genc_id,
            'reactions.userId': userId
        },

            {
                $set: {
                    'reactions.$.react': react
                }
            },

            {
                new: true
            }

        ).then(async (result) => {
            if (!result) {
                await Message.findOneAndUpdate(
                    { genc_id },
                    { $addToSet: { reactions: reaction } },
                    { new: true }
                )
            }
        }).catch(err => console.log(err));

        io.to(roomId).emit('reactFromServer', reaction);
    })

    socket.on('removeReact', async (data) => {
        const { userId, genc_id, roomId } = data;
        await Message.findOneAndUpdate(
            { genc_id },
            { $pull: { reactions: { userId } } },
            { new: true }
        )
        io.to(roomId).emit('removeReactServer', {
            userId,
            genc_id
        })
    })

    socket.on('disconnect', () => {
        io.emit('someoneDisconnected', 'Someone disconnected.');
    })
})

app.get("/", (req, res) => {
    res.status(200).json({
        message: "iCHAT SERVER IS RUNNING!"
    })
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use('/api/users/v1/', userRoutes);
app.use('/api/messages/v1', messageRoutes);

const PORT = process.env.PORT || 9090;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        if (mongoose.connection) {
            console.log('DATABASE CONNECTED');
            server.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`));
        }
    }).catch((err) => console.log(err));