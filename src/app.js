require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express();
const PORT = process.env.PORT || 3000
// const db = require('./db');
var bp = require('body-parser')

// Routes
const authRoute = require('./routes/auth');
const incomingRoute = require('./routes/incoming');
const adminRoute = require('./routes/admin')


// app.use(express.json());
app.use(morgan('dev'))
app.use(bp.json());
app.use(bp.urlencoded({
    extended: true
}));

app.get('/', async (req, res) => {
    res.json({ 'message': 'Succes' }).status(200)
})

app.use('/auth', authRoute);
app.use('/incoming', incomingRoute)
app.use('/admin', adminRoute)

app.listen(PORT, () => {
    console.log(`SERVER LISTENING ON ${PORT}`);
})