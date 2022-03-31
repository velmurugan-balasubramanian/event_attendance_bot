

const checkInCard = async (event_name) => {

    let card = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.3",
        "body": [
            {
                "type": "Input.Text",
                "id": "action",
                "value": "event_details",
                "isVisible": false,
                "placeholder": "Enter a name for the event",
            },
            {
                "type": "TextBlock",
                "text": `You Checked in to the ${event_name} `,
                "wrap": true
            }
        ],
        "actions": [
        ]

    }

    // console.log('card', card);
    return card

}

module.exports = checkInCard;
