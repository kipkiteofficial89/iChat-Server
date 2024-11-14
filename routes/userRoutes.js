const express = require('express');
const userRoutes = express.Router();
const {
    joinUser,
    getUser,
    searchPeople,
    getUserInfo,
    fetchConnectedPeoples
} = require('../controllers/userControllers');
const { authMiddleware } = require('../middlewares/authMiddleware');

userRoutes.post('/joinUser', joinUser);
userRoutes.get('/getUser', authMiddleware, getUser);
userRoutes.get('/searchPeople', authMiddleware, searchPeople);
userRoutes.get('/getUserInfo', authMiddleware, getUserInfo);
userRoutes.get('/fetchConnectedPeoples', authMiddleware, fetchConnectedPeoples);

module.exports = userRoutes;