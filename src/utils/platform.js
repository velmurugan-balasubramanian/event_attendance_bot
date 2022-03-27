const rc = require('ringcentral');
const fs = require('fs');

const dbUtil = require('../utils/db')
const REDIRECT_HOST = process.env.REDIRECT_HOST;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const RINGCENTRAL_ENV = process.env.RINGCENTRAL_ENV;
const TOKEN_TEMP_FILE = '.bot-auth';



rcsdk = new rc({
    server: RINGCENTRAL_ENV,
    appKey: CLIENT_ID,
    appSecret: CLIENT_SECRET
});

platform =  rcsdk.platform();

module.exports = platform;