const router = require('express').Router()
const { renewSubscription } = require('../utils/subscription');
const { sendMessage, sendCard, updateCard, updateRSVP } = require('../utils/cards')
const platform = require('../utils/platform');

const dbUtil = require('../utils/db')

const rsvp = require('../cards/rsvp');
const editRsvp = require('../cards/editRsvp');


router.get('/test', async (req, res) => {
    res.json({ message: 'ok' }).status(200)
})

router.post('/callback', async (req, res) => {
    console.log('PRINTING REQUEST BODY');
    console.log(req.body);
    let validationToken = req.get('Validation-Token');
    let body = [];
    if (validationToken) {
        console.log('Verifying webhook.');
        res.setHeader('Validation-Token', validationToken);

    } else if (req.body.event == "/restapi/v1.0/subscription/~?threshold=60&interval=15") {
        console.log("Renewing subscription ID: " + req.body.subscriptionId);
        renewSubscription(req.body.subscriptionId);

    } else if (req.body.body.eventType == "PostAdded") {
        if (req.body.ownerId == req.body.body.creatorId) {
            console.log("Ignoring message posted by bot.");
        }
        else if (req.body.body.eventType == "ping"){
            sendMessage("I do not understand pong", req.body.body.groupId)
        }
        else if (req.body.body.text === "check-in") {
            sendCard(rsvp(), req.body.body.groupId);
        }
        else if (req.body.body.text == "rsvp") {
            sendCard(rsvp(), req.body.body.groupId);
        }
        else {
            sendMessage("I do not understand '" +
                req.body.body.text +
                "'", req.body.body.groupId)
        }
    }
    res.json({ 'message': 'ok' }).status(200)
})

// This handler is called when a user submit data from an adaptive card
router.post('/interactive', async function (req, res) {
    console.log('Printing the message from the card');

    console.log(req.body);

    let person = await platform.get(`/restapi/v1.0/glip/persons/${req.body.user.accountId}`).then(response => {
        return response.json()
    })
    console.log("PERSON", person);
    //  let ticketDATA = await create_ticket(req.body.data.title, req.body.data.description, req.body.conversation.id, person.email)
    // // console.log('TICKET DDATA', ticketDATA);
    let result = await dbUtil.create(req.body.card.id, req.body.conversation.id, person.id, person.email, 'xxxxxxx', 'event-1')

    updateCard(req.body.conversation.id,
        req.body.card.id,
        editRsvp(req.body.data.name, req.body.data.company_name, req.body.data.rsvp, req.body.data.vaccination))
    sendMessage("Thanks for your interest :), your response has been recorded.", req.body.conversation.id)
    res.statusCode = 200;
    res.end('');
});


module.exports = router;