require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express();
const PORT = process.env.PORT || 3000
var bp = require('body-parser')

// Routes
const authRoute = require('./routes/auth');
const incomingRoute = require('./routes/incoming');
const adminRoute = require('./routes/admin')


app.use(morgan('dev'))
app.use(bp.json());
app.use(bp.urlencoded({
    extended: true
}));

app.get('/test', async (req, res) => {
    console.log('REQ', req);
    res.json({ 'message': 'Succes' }).status(200)
})

app.post('/test', async (req, res) => {
    console.log('REQ', req);
    res.json({ 'message': 'Succes' }).status(200)
})

app.use('/auth', authRoute);
app.use('/incoming', incomingRoute)
app.use('/admin', adminRoute)

app.listen(PORT, () => {
    console.log(`SERVER LISTENING ON ${PORT}`);
})