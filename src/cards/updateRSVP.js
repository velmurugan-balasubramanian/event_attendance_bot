const editRSVP = (event, rsvp) => {
    console.log("EVENT", event);
    console.log("RSVP in update rsvp", rsvp);


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
                "type": "TextBlock",
                "size": "Medium",
                "weight": "Bolder",
                "text": `You RSVPd ${rsvp.rsvp} for the event  ${event.event_name} on ${new Date(event.event_date).toLocaleDateString()} , between ${event.event_start_time.substring(0,5)} and ${event.event_end_time.substring(0,5)}`,
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
                            "value": rsvp.rsvp,
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
                            "value": rsvp.vaccination,
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
