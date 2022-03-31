const sendInvitation = (bot_id, event_type, event) => {

    let eventImages = {
        'sports': 'https://img.icons8.com/stickers/452/sport.png',
        'concert': 'https://img.icons8.com/stickers/344/rock-music.png',
        'dinner': 'https://img.icons8.com/stickers/344/food-and-wine.png',
        'lunch': 'https://img.icons8.com/stickers/344/pizza.png'
    }

    let eventType = event_type


    let card = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.3",
        "body": [
            {
                "type": "Input.Text",
                "id": "event_id",
                "value": event.event_id,
                "isVisible": false,
            },
            {
                "type": "Input.Text",
                "id": "bot_id",
                "value": bot_id,
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
                "id": "action",
                "value": "invitation",
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
                                "text": `Invitation to ${event.event_name}`,
                                "wrap": true
                            }
                        ],
                        "width": "auto"
                    }
                ]
            },
            {
                "type": "Input.Text",
                "id": "event_text",
                "value": `Invitation to ${event.event_name}`,
                "isVisible": false,
            },
            {
                "type": "TextBlock",
                "size": "Medium",
                "weight": "Bolder",
                "text": `You have been invited to ${event.event_name} on ${new Date(event.event_date).toLocaleDateString()} , between ${event.event_start_time} and ${event.event_end_time}`,
                "wrap": true
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
                "isRequired": true,
                "value": "yes",
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
                "isRequired": true,
                "value": "yes",
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
                "title": "RSVP to the Event"
            }
        ]

    }

    return card

}





module.exports = sendInvitation;
