
const eventDetails = async (eventDetails) => {

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
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Invited",
                                "wrap": true
                            },
                            {
                                "type": "TextBlock",
                                "text": `${eventDetails.attendees.length}`,
                                "wrap": true
                            }
                        ],
                        "width": "auto"
                    },
                    {
                        "type": "Column",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Yes",
                                "wrap": true
                            },
                            {
                                "type": "TextBlock",
                                "text": `${eventDetails.attending.length}`,
                                "wrap": true
                            }
                        ],
                        "width": "auto"
                    },
                    {
                        "type": "Column",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "No",
                                "wrap": true
                            },
                            {
                                "type": "TextBlock",
                                "text": `${eventDetails.not_attending.length}`,
                                "wrap": true
                            }
                        ],
                        "width": "auto"
                    },
                    {
                        "type": "Column",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Maybe",
                                "wrap": true
                            },
                            {
                                "type": "TextBlock",
                                "text": `${eventDetails.maybe_attending.length}`,
                                "wrap": true
                            }
                        ],
                        "width": "auto"
                    }
                ]
            },
        ],
        "actions": [
        ]

    }

    console.log('card', card);
    return card

}

module.exports = eventDetails;
