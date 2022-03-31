
const chooseTeam = async (teams, bot_id, text) => {


    let eventType = ''

    let eventImages = {
        'sports': 'https://img.icons8.com/stickers/452/sport.png',
        'concert': 'https://img.icons8.com/stickers/344/rock-music.png',
        'dinner': 'https://img.icons8.com/stickers/344/food-and-wine.png',
        'lunch': 'https://img.icons8.com/stickers/344/pizza.png'
    }

    if (text.indexOf('sports') >= 0 || text.indexOf('Sports') >= 0 || text.indexOf('game') >= 0) eventType = 'sports'
    if (text.indexOf('concert') >= 0 || text.indexOf('Concert') >= 0) eventType = 'concert'
    if (text.indexOf('dinner') >= 0 || text.indexOf('Dinner') >= 0) eventType = 'dinner'
    if (text.indexOf('lunch') >= 0 || text.indexOf('Lunch') >= 0) eventType = 'lunch'

    let card = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.3",
        "body": [
            {
                "type": "Input.Text",
                "id": "action",
                "value": "choose_team",
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
                "type": "Input.Text",
                "id": "event_type",
                "value": eventType,
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
                                "text": `Create a ${eventType} Event`,
                                "wrap": true
                            }
                        ],
                        "width": "auto"
                    }
                ]
            },
            {
                "type": "TextBlock",
                "text": "Select a team to create event",
                "wrap": true
            },
            {
                "type": "Input.ChoiceSet",
                "id": "team",
                "choices": teams
            }
        ],
        "actions": [
            {
                "type": "Action.Submit",
                "title": "Create Event"
            }
        ]

    }

    return card

}

module.exports = chooseTeam;
