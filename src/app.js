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
    console.log('PGUSER', process.env.PGUSER);
    console.log('PGHOST', process.env.PGHOST);
    console.log('PGPASSWORD', process.env.PGPASSWORD);
    console.log('PGDATABASE', process.env.PGDATABASE);
    console.log('PGPORT', process.env.PGPORT);
    console.log('REDIRECT_HOST', process.env.REDIRECT_HOST);
    console.log('CLIENT_ID', process.env.CLIENT_ID);
    console.log('CLIENT_SECRET', process.env.CLIENT_SECRET);
    console.log('RINGCENTRAL_ENV', process.env.RINGCENTRAL_ENV);
    console.log(`SERVER LISTENING ON ${PORT}`);
})