const express = require('express')
const cors = require("cors")
const app = express();
app.use(express.json());
const payment = require('./routes/payment')
const errorMiddleware = require('./middleware/error')
const cookieparser = require('cookie-parser')
// const path = require('path')
const products = require('./routes/products')
const auth = require('./routes/auth');
const dotenv = require('dotenv');
const order = require('./routes/order');
const path = require('path');
// const payment = require('./routes/payment');
dotenv.config({ path: path.join(__dirname, "config/config.env") });



app.use(`/uploads`, express.static(path.join(__dirname, 'uploads')))

app.use(express.json());
app.use(cookieparser());
app.use(`/api/v1/`, products)
app.use(`/api/v1/`, auth)
app.use(`/api/v1/`, order)
app.use(`/api/v1/`, payment)


app.use(errorMiddleware)
app.use(cors());
module.exports = app; 