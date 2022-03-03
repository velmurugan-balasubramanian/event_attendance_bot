const sendInvitation = (event) => {

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
                "id": "action",
                "value": "invitation",
                "isVisible": false,
            },
            {
                "type": "Input.Text",
                "id": "event_text",
                "value": `You have been invited to ${event.event_name} event`,
                "isVisible": false,
            },
            {
                "type": "TextBlock",
                "size": "Medium",
                "weight": "Bolder",
                "text": `You have been invited to ${event.event_name} event`,
                "wrap": true
            },
            {
                "type": "TextBlock",
                "size": "Medium",
                "weight": "Bolder",
                "text": `You have been invited to ${event.event_name} event on ${new Date(event.event_date).toLocaleDateString()} , between ${event.event_start_time} and ${event.event_end_time}`,
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
                "value": "1",
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
                "value": "1",
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
