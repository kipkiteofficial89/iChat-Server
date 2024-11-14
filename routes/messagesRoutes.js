const express = require('express');
const messageRoutes = express.Router();
const {
    getConversation,
} = require('../controllers/messagesControllers');
const { authMiddleware } = require('../middlewares/authMiddleware');

messageRoutes.get('/getConversation', authMiddleware, getConversation);

module.exports = messageRoutes;