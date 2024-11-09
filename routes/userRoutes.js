const express = require('express');
const userRoutes = express.Router();
const {
    joinUser,
    getUser
} = require('../controllers/userControllers');
const { authMiddleware } = require('../middlewares/authMiddleware');

userRoutes.post('/joinUser', joinUser);
userRoutes.get('/getUser', authMiddleware, getUser);

module.exports = userRoutes;