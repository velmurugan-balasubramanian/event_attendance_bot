const schedulerUtil = require('../utils/scheduler')
const createEvent = async (event_origin, event_owner) => {

    let timeZones = await schedulerUtil.getTimeZones()

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
                "placeholder": "Enter a name for the event",
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
                "type": "TextBlock",
                "size": "Medium",
                "weight": "Bolder",
                "text": "Create an Event",
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": "Name for the event",
                "wrap": true
            },
            {
                "type": "Input.Text",
                "id": "event_name",
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
                "choices": timeZones
            },
            {
                "type": "TextBlock",
                "text": "Remind Users before",
                "wrap": true
            },
            {
                "type": "Input.ChoiceSet",
                "id": "remindBefore",
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
                "type": "Input.Toggle",
                "id": "send_reminder",
                "title": "Do you want to send reminder to the participants before the event?",
                "value": "true",
                "valueOn": "true",
                "valueOff": "false",
                "label": "Please select to send notification to the participants",
                "isRequired": false,
                "errorMessage": "You must select"
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
