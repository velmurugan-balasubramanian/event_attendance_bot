
const getDetails = async (events) => {
    console.log('GET details',events);

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
                "type": "TextBlock",
                "text": "Choose action",
                "wrap": true
            },
            {
                "type": "Input.ChoiceSet",
                "id": "get_rsvp",
                "choices": [
                    {
                        "title": "Get RSVP Yes",
                        "value": "yes"
                    },
                    {
                        "title": "Get RSVP No",
                        "value": "no"
                    },
                    {
                        "title": "Get all the attendees ",
                        "value": "all"
                    }
                ]
            },
            {
                "type": "TextBlock",
                "text": "Choose Team",
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

    console.log('card',card);
    return card

}

module.exports = getDetails;
