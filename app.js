/*
This is a sample bot application for RingCentral. Learn more about this 
app by following the instructions found at the URL below:
https://developers.ringcentral.com/guide/team-messaging/bots/walkthrough/

Copyright: 2021 - RingCentral, Inc.
License: MIT
*/
require('dotenv').config();

const RC = require('ringcentral');
var express = require('express');
var request = require('request');
var bp = require('body-parser')
var fs = require('fs');
// read in config parameters from environment, or .env file
const PORT = process.env.PORT;
const REDIRECT_HOST = process.env.REDIRECT_HOST;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const RINGCENTRAL_ENV = process.env.RINGCENTRAL_ENV;
const TOKEN_TEMP_FILE = '.bot-auth';

var app = express();
var platform, subscription, rcsdk, subscriptionId, bot_token;

app.use(bp.json());
app.use(bp.urlencoded({
    extended: true
}));

app.listen(PORT, function () {
    console.log("Bot server listening on port " + PORT);
});

rcsdk = new RC({
    server: RINGCENTRAL_ENV,
    appKey: CLIENT_ID,
    appSecret: CLIENT_SECRET
});

platform = rcsdk.platform();
if (fs.existsSync(TOKEN_TEMP_FILE)) {
    var data = JSON.parse(fs.readFileSync(TOKEN_TEMP_FILE));
    console.log("Reusing access key from cache: " + data.access_token)
    platform.auth().setData(data);
}

app.get('/oauth', function (req, res) {
    console.log('Is this the default route, Oauth get?');
    console.log("Public bot being installed");
    if (!req.query.code) {
        res.status(500).send({ "Error": "No authorization token received." }).end();
        console.log("RingCentral did not transmit an authorizaton token.");
    } else {
        var creatorId = req.query.creator_extension_id;
        platform.login({
            code: req.query.code,
            redirectUri: REDIRECT_HOST + '/oauth'
        }).then(function (authResponse) {
            subscribeToEvents();
        }).catch(function (e) {
            console.error(e)
            res.status(500).send("Error installing bot and subscribing to events: ", e).end()
        })
    }
    res.status(200).send("").end();
});

// Handle authorization for public bots
//
// When a private bot is installed, RingCentral transmits a permanent access key
// to the bot via an HTTP POST. 
//
// Then the bot subscribes to webhooks so that it can respond to message
// events.
//
// This server stores that key in memory. As a result, if the server is
// restarted, you will need to remove and reinstall the not in order to obtain
// a fresh API token. In a more advanced implementation, the acess key would
// be persisted so that it can easily be re-used if the server is restarted. 
app.post('/oauth', function (req, res) {
    console.log('Is this the default route, Oauth post?');
    res.status(200);
    if (req.body.access_token) {
        console.log("Verifying redirect URL for bot server.")

        // Normally, the access token in the SDK is set by the login()
        // method. Here, we bypass the login method to set the access
        // token directly.
        var data = platform.auth().data();
        data.token_type = "bearer"
        data.expires_in = 100000000000;
        data.access_token = req.body.access_token;
        data.refresh_token = 'xxx';
        data.refresh_token_expires_in = 10000000000;
        platform.auth().setData(data);

        console.log("Stashing access key: " + req.body.access_token)
        fs.writeFileSync(TOKEN_TEMP_FILE, JSON.stringify(data))

        try {
            subscribeToEvents();
        } catch (e) {
            res.status(500).send("Error: ", e).end();
        }
    }
    res.send("").end()
});