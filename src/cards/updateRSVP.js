const editRSVP = (event, cardBody) => {
    console.log("EVENT", event);
    console.log("RSVP in update rsvp", cardBody.event_type);

    let eventImages = {
        'sports': 'https://img.icons8.com/stickers/452/sport.png',
        'concert': 'https://img.icons8.com/stickers/344/rock-music.png',
        'dinner': 'https://img.icons8.com/stickers/344/food-and-wine.png',
        'lunch': 'https://img.icons8.com/stickers/344/pizza.png'
    }

    let eventType = cardBody.event_type

    let card = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.3",
        "body": [
            {
                "type": "Input.Text",
                "id": "action",
                "value": "edit_rsvp",
                "isVisible": false,
            },
            {
                "type": "Input.Text",
                "id": "event_id",
                "value": event.event_id,
                "isVisible": false,
            },
            {
                "type": "Input.Text",
                "id": "event_type",
                "value": eventType,
                "isVisible": false,
            },
            {
                "type": "Input.Text",
                "id": "bot_id",
                "value": cardBody.bot_id,
                "isVisible": false,
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "items": [
                            {
                                "type": "Image",
                                "url": eventImages[eventType],
                                "size": "small",
                                "style": "person"
                            }
                        ],
                        "width": "auto"
                    },
                    {
                        "type": "Column",
                        "items": [
                            {
                                "type": "TextBlock",
                                "size": "large",
                                "color": "dark",
                                "weight": "Bolder",
                                "text": `invitation to the ${event.event_name} event`,
                                "wrap": true
                            }
                        ],
                        "width": "auto"
                    }
                ]
            },
            {
                "type": "TextBlock",
                "size": "Medium",
                "weight": "Bolder",
                "text": `You RSVPd ${cardBody.rsvp} for the event  ${event.event_name} on ${new Date(event.event_date).toLocaleDateString()} , between ${event.event_start_time.substring(0, 5)} and ${event.event_end_time.substring(0, 5)}`,
                "wrap": true
            },
        ],
        "actions": [
            {
                "type": "Action.ShowCard",
                "title": "Edit RSVP",
                "card": {
                    "type": "AdaptiveCard",
                    "body": [
                        {
                            "type": "Input.Text",
                            "id": "event_text",
                            "value": `Edit your RSVP for ${event.event_name} event`,
                            "isVisible": false,
                        },
                        {
                            "type": "TextBlock",
                            "size": "Medium",
                            "text": `Please disclose your vaccination status and record your RSVP to the event by filling out the below details`,
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "RSVP",
                            "wrap": true
                        },
                        {
                            "type": "Input.ChoiceSet",
                            "id": "rsvp",
                            "value": cardBody.rsvp,
                            "choices": [
                                {
                                    "title": "Yes",
                                    "value": "yes"
                                },
                                {
                                    "title": "No",
                                    "value": "no"
                                },
                                {
                                    "title": "Maybe",
                                    "value": "maybe"
                                }
                            ]
                        },
                        {
                            "type": "TextBlock",
                            "text": "Are you Vaccinated",
                            "wrap": true
                        },
                        {
                            "type": "Input.ChoiceSet",
                            "id": "vaccination",
                            "value": cardBody.vaccination,
                            "choices": [
                                {
                                    "title": "Yes",
                                    "value": "yes"
                                },
                                {
                                    "title": "No",
                                    "value": "no"
                                },
                                {
                                    "title": "Do not want to disclose",
                                    "value": "dwts"
                                }
                            ]
                        }
                    ],
                    "actions": [
                        {
                            "type": "Action.Submit",
                            "title": "Edit RSVP to the Event"
                        }
                    ]
                }
            }
        ]
    }

    return card

}

module.exports = editRSVP
