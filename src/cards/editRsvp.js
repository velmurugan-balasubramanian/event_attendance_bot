const editRSVP = (name, company_name, RSVP, vaccination_status) => {
    let card = {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.3",
        "body": [
            {
                "type": "TextBlock",
                "size": "Medium",
                "weight": "Bolder",
                "text": "RSVP to the event",
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": "Name",
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": name,
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": "Company",
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": company_name,
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": "Vaccination Status",
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": vaccination_status,
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": "RSVP",
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": RSVP,
                "wrap": true
            }
        ],
        "actions": [
            {
                "type": "Action.ShowCard",
                "title": "Edit RSVP",
                "card": {
                    "type": "AdaptiveCard",
                    "body": [
                        {
                            "type": "TextBlock",
                            "size": "Medium",
                            "weight": "Bolder",
                            "text": "RSVP to the event",
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "Enter your Name",
                            "wrap": true
                        },
                        {
                            "type": "Input.Text",
                            "id": "name",
                            "placeholder": "Enter your name"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Enter your Company name ",
                            "wrap": true
                        },
                        {
                            "type": "Input.Text",
                            "id": "company_name",
                            "placeholder": "Enter your Company name "
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