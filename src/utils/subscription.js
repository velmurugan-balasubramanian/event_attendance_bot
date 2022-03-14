const platform = require('./platform')

const REDIRECT_HOST = process.env.REDIRECT_HOST;


const subscribeToEvents = async (token) => {

    try {
        console.info("Subscribing to post and group events")
        var requestData = {
            "eventFilters": [
                "/restapi/v1.0/glip/posts",
                "/restapi/v1.0/glip/groups",
                "/restapi/v1.0/subscription/~?threshold=60&interval=15",
                "/restapi/v1.0/glip/teams"
            ],
            "deliveryMode": {
                "transportType": "WebHook",
                "address": REDIRECT_HOST + "/incoming/callback"
            },
            "expiresIn": 604799
        };
        let response = await platform.post('/subscription', requestData)
        let subscriptionId = response.json().id

        return subscriptionId

    } catch (error) {

        console.error(error);

    }

}

const renewSubscription = (id) => {
    console.log("Renewing Subscription");
    platform.post('/subscription/' + id + "/renew")
        .then(function (response) {
            var data = JSON.parse(response.text());
            console.log("Subscription renewed. Next renewal:" + data.expirationTime);
        }).catch(function (e) {
            console.log("Error subscribing to bot events: ", e);
            throw e;
        });
}

module.exports = {
    subscribeToEvents: subscribeToEvents,
    renewSubscription: renewSubscription
}

