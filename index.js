require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use('/api/users/v1/', userRoutes);

const PORT = process.env.PORT || 9090;
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => {
        if (mongoose.connection) {
            console.log('DATABASE CONNECTED');
            app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`));
        }
    }).catch((err) => console.log(err));