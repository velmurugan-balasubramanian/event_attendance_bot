const platform = require('./platform')

const REDIRECT_HOST = process.env.REDIRECT_HOST;


const subscribeToEvents = (token) => {
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
    platform.post('/subscription', requestData)
        .then(function (subscriptionResponse) {
            console.log('Subscription Response: ', subscriptionResponse.json());
            subscriptionId = subscriptionResponse.id;
        }).catch(function (e) {
            console.error('There was a problem subscribing to events. ', e);
            throw e;
        });
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
    subscribeToEvents:subscribeToEvents,
    renewSubscription:renewSubscription
}

