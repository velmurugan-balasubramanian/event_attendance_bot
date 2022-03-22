
const getDetails = async (events, bot_id) => {

    let card = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.3",
        "body": [
            {
                "type": "Input.Text",
                "id": "action",
                "value": "get_details",
                "isVisible": false,
                "placeholder": "Enter a name for the event",
            },
            {
                "type": "Input.Text",
                "id": "bot_id",
                "value": bot_id,
                "isVisible": false,
            },
            {
                "type": "TextBlock",
                "text": "Choose an Event to get Details",
                "wrap": true
            },
            {
                "type": "Input.ChoiceSet",
                "id": "event",
                "choices": events
            }
        ],
        "actions": [
            {
                "type": "Action.Submit",
                "title": "Get Details"
            }
        ]

    }

    console.log('card', card);
    return card

}

module.exports = getDetails;
