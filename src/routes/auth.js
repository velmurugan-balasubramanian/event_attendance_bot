const router = require('express').Router()
const platform = require('../utils/platform.js');
const { subscribeToEvents } = require('../utils/subscription')
const dbUtil = require('../utils/db')

// const rc = require('ringcentral');
const fs = require('fs')


const REDIRECT_HOST = process.env.REDIRECT_HOST;

/**
 * Authorize
 */
router.get('/oauth', async (req, res) => {

    console.log("Oauth GET", req.query);

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
            console.log('Params', params);
            var resp = await platform.login(params)
            // Get bot access token. The tokens is per user's account
            var token = await resp.json()
            var resp1 = await platform.get('/restapi/v1.0/account/~/extension/~')
            var jsonObj = await resp1.json()
            token['refresh_token'] = 'xxx';
            token['refresh_token_expires_in'] = 10000000000;
            token['token_type'] = "bearer"
            token['accountId'] = jsonObj.account.id
            // console.log('JAOn IO', jsonObj);
            // token['subscriptionId']  = jsonObj.
            
            let subscriptionId = await subscribeToEvents();

            await dbUtil.saveToken(token);

            res.status(200).send("")
            console.log("Subscribe to Webhooks notification")

        } catch (error) {
            console.log("Error while installing the bot");
            console.error(error);
            res.status(500).send("").end();
        }
    }
})


module.exports = router;