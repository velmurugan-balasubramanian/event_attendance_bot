require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express();
const PORT = process.env.PORT||3000
// const db = require('./db')
const authRoute = require('./routes/auth')


app.use(express.json());
app.use(morgan('dev'))


app.use('/auth',authRoute);

app.listen(PORT, ()=>{
    console.log(`SERVER LISTENING ON ${PORT}`);
})