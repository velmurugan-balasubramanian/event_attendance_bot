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
            "expiresIn": 630720000
        };
        let response = await platform.post('/subscription', requestData)
        let subscriptionId = response.json().id

        return subscriptionId

    } catch (error) {
        console.error('Unable to renew Subscription');
        console.error(error);

    }

}

const renewSubscription = async (id) => {
    console.info("Renewing Subscription");
    try {
        let response = await platform.post('/subscription/' + id + "/renew")
        let result = await response.json()
        console.log('safs', result);
        return response
    } catch (error) {
        console.error('Unable to renew subscription');
        console.error(error);
    }
}

module.exports = {
    subscribeToEvents: subscribeToEvents,
    renewSubscription: renewSubscription
}

