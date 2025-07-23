const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./initDB');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/auth/", authRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/product/", productRoutes);

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(port, () => {
    console.log('Server started running on port ', port);
});

