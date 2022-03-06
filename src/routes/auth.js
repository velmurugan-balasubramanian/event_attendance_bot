const router = require('express').Router()
const platform = require('../utils/platform.js');
const { subscribeToEvents } = require('../utils/subscription')
const dbUtil = require('../utils/db')

// const rc = require('ringcentral');
const fs = require('fs')


const REDIRECT_HOST = process.env.REDIRECT_HOST;
// const TOKEN_TEMP_FILE = '.bot-auth';
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const RINGCENTRAL_ENV = process.env.RINGCENTRAL_ENV;
// require('../../.bot-auth');

// rcsdk = new rc({
//     server: RINGCENTRAL_ENV,
//     appKey: CLIENT_ID,
//     appSecret: CLIENT_SECRET
// });

// let platform = rcsdk.platform();
// if (fs.existsSync(TOKEN_TEMP_FILE)) {
//     var data = JSON.parse(fs.readFileSync(TOKEN_TEMP_FILE));
//     console.log("Reusing access key from cache: " + data.access_token)
//     platform.auth().setData(data);
// }

/**
 * Authorize
 */
router.get('/oauth', async (req, res) => {

    // console.log("Oauth GET", req);

    if (!req.query.code) {
        res.status(500).send({ "Error": "No authorization token received." }).end();
        console.log("RingCentral did not transmit an authorizaton token.");
    } else {
        var creatorId = req.query.creator_extension_id;
        try {
            var params = {
                code: req.query.code,
                redirectUri: REDIRECT_HOST + '/auth/oauth'
            }
            var resp = await platform.login(params)
            // Get bot access token. The tokens is per user's account
            var tokens = await resp.json()
            var resp1 = await platform.get('/restapi/v1.0/account/~/extension/~')
            var jsonObj = await resp1.json()
            tokens['refresh_token'] = 'xxx';
            tokens['refresh_token_expires_in'] = 10000000000;
            tokens['token_type'] = "bearer"

            // var accountTokenObj = {
            //     ownerId: tokens.owner_id, // Bot extension id
            //     accountId: jsonObj.account.id, // User account id
            //     tokens: tokens,
            //     subscriptionId: ''
            // }

            // accountTokens.push(accountTokenObj)
            subscribeToEvents()
            await dbUtil.saveToken(tokens);
            res.status(200).send("")
            console.log("Subscribe to Webhooks notification")

        } catch (error) {
            res.status(200).send("").end();
        }
        // platform.login({
        //     code: req.query.code,
        //     redirectUri: REDIRECT_HOST + '/auth/oauth'
        // }).then(function (authResponse) {
        //     console.log('Authenticated');
        //     subscribeToEvents()
        //     console.log('authResponse', authResponse);
        // }).catch(function (e) {
        //     console.error(e)
        //     res.status(500).send("Error installing bot and subscribing to events: ", e).end()
        // })
    }
})


/**
 * 
 */
router.post('/oauth', async (req, res) => {

    console.log("Oauth POst", req.body);

    let body = req.body

    console.log("Stashing access key: " + req.body.access_token)
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
        await dbUtil.saveToken(data);
        // fs.writeFileSync(TOKEN_TEMP_FILE, JSON.stringify(data))

        try {
            subscribeToEvents();
        } catch (e) {
            res.status(500).send("Error: ", e).end();
        }
    }
    res.status(200).send("").end()
})



module.exports = router;