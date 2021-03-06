const schedulerUtil = require('../utils/scheduler')
const createEvent = async (bot_id, event_origin, event_owner, text) => {

    let timeZones = await schedulerUtil.getTimeZones()

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

    console.log('Eventtype', eventType);

    let card = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.3",
        "body": [
            {
                "type": "Input.Text",
                "id": "action",
                "value": "create_event",
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
                "id": "event_origin",
                "value": event_origin,
                "isVisible": false,
                "placeholder": "Enter a name for the event",
            },
            {
                "type": "Input.Text",
                "id": "event_owner",
                "value": event_owner,
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
                                "text": `Create ${eventType} Event`,
                                "wrap": true
                            }
                        ],
                        "width": "auto"
                    }
                ]
            },
            {
                "type": "TextBlock",
                "text": "Name for the event",
                "wrap": true
            },
            {
                "type": "Input.Text",
                "id": "event_name",
                "isRequired": true,
                "placeholder": "Enter a name for the event",
                "maxLength": 500
            },
            {
                "type": "TextBlock",
                "text": "Input Event date",
                "wrap": true
            },
            {
                "type": "Input.Date",
                "id": "event_date",
                "isRequired": true,
                "placeholder": "Enter a date for the Event"
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Input Event Start Time",
                                "wrap": true
                            },
                            {
                                "type": "Input.Time",
                                "id": "event_start_time",
                                "isRequired": true,
                                "placeholder": "Enter event start time"
                            },
                        ],
                        "width": "auto"
                    },
                    {
                        "type": "Column",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Input Event End Time",
                                "wrap": true
                            },
                            {
                                "type": "Input.Time",
                                "id": "event_end_time",
                                "isRequired": true,
                                "placeholder": "Enter event end time"
                            },
                        ],
                        "width": "stretch"
                    }
                ]
            },
            {
                "type": "TextBlock",
                "text": "Enter the timeZone of the meeting",
                "wrap": true
            },
            {
                "type": "Input.ChoiceSet",
                "id": "timezone",
                "isRequired": true,
                "choices": timeZones
            },
            {
                "type": "TextBlock",
                "text": "Remind Participants",
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": "First reminder before",
                "wrap": true
            },
            {
                "type": "Input.ChoiceSet",
                "id": "first_reminder",
                "isRequired": true,
                "value": "60",
                "choices": [
                    {
                        "title": "15 Minutes",
                        "value": "15"
                    },
                    {
                        "title": "30 Minutes",
                        "value": "30"
                    },
                    {
                        "title": "45 Minutes",
                        "value": "45"
                    },
                    {
                        "title": "1 Hour",
                        "value": "60"
                    },
                    {
                        "title": "2 Hours",
                        "value": "120"
                    },
                    {
                        "title": "4 Hours",
                        "value": "240"
                    },
                    {
                        "title": "1 Day",
                        "value": "1440"
                    }
                ]
            },
            {
                "type": "TextBlock",
                "text": "Second Reminder before",
                "wrap": true
            },
            {
                "type": "Input.ChoiceSet",
                "id": "second_reminder",
                "isRequired": true,
                "value": "60",
                "choices": [
                    {
                        "title": "15 Minutes",
                        "value": "15"
                    },
                    {
                        "title": "30 Minutes",
                        "value": "30"
                    },
                    {
                        "title": "45 Minutes",
                        "value": "45"
                    },
                    {
                        "title": "1 Hour",
                        "value": "60"
                    },
                    {
                        "title": "2 Hours",
                        "value": "120"
                    },
                    {
                        "title": "4 Hours",
                        "value": "240"
                    },
                    {
                        "title": "1 Day",
                        "value": "1440"
                    }
                ]
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

module.exports = createEvent;
