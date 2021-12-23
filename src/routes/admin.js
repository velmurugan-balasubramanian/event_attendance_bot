const router = require('express').Router()
const platform = require('../utils/platform.js');


router.post('/create_team', async (req, res) => {

    platform.post('/restapi/v1.0/glip/teams', { name: "event4" })
        .then((data) => {
            let resp = data.json()
            res.json(resp).status(200)
        })
        .catch((error) => {
            console.log('Error', error);
        })
})


module.exports = router;