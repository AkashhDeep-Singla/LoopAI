require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ingestionRoutes = require('./routes/ingestionRoutes');
const ConnectDB = require('./db');
require('./worker/processor');

const app = express();
app.use(express.json());
app.use('/', ingestionRoutes);


app.listen(5000, () => console.log('Server running on port 5000'))
ConnectDB()