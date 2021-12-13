const router = require('express').Router()




/**
 * Authorize
 */
router.get('/oauth', (req, res) => {
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
})


/**
 * 
 */
router.post('/oauth', (req, res) => {
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
})



module.exports = router;