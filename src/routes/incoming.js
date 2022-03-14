const router = require('express').Router()
const { nanoid } = require('nanoid')
const { renewSubscription } = require('../utils/subscription');
const { sendMessage, sendCard, updateCard } = require('../utils/cards')

// Import Utils
const dbUtil = require('../utils/db')
const teamUtil = require('../utils/team')
const schedularUtil = require('../utils/scheduler')

// Import cards
const createEvent = require('../cards/createEvent');
const updateEvent = require('../cards/updateEvent');
const getDetails = require('../cards/getDetails');
const editRSVP = require('../cards/updateRSVP');
const eventDetails = require('../cards/eventDetail')

const CREATE_COMMANDS = [
    "bot create sports event",
    "bot create lunch event",
    "bot create a lunch event",
    "bot create a dinner event",
    "bot create dinner event",
    "bot create a concert event",
    "bot create concert event",
    "bot create concert",
]

router.get('/test', async (req, res) => {
    res.json({ message: 'ok' }).status(200).end()
})

router.post('/callback', async (req, res) => {

    console.log('body', req.body);

    // owner_id
    const response = await dbUtil.findTokenFromSubscriptionId(req.body.ownerId);
    const token = response.rows[0];

    try {
        let validationToken = req.get('Validation-Token');

        if (validationToken) {
            console.log('Verifying webhook.');
            res.setHeader('Validation-Token', validationToken);
            res.json({ 'success': true }).status(200).end()
            return
        }
        if (req.body.event == "/restapi/v1.0/subscription/~?threshold=60&interval=15") {
            console.log("Renewing subscription ID: " + req.body.subscriptionId);
            renewSubscription(req.body.subscriptionId);
            res.json({ 'success': true }).status(200).end();
            return
        }
        if (req.body.body.eventType === "GroupJoined") {

            // Get Team details from the conversation ID
            let teamDetails = await teamUtil.getTeam(token, req.body.body.id)

            // Create a DB entry with team details in the team table
            let dbResult = await dbUtil.createTeam(teamDetails)
            res.json({ 'success': true }).status(200).end()
            return
        }
        if (req.body.body.eventType === "PostAdded") {

            let botCommand = req.body.body.text || ''
            if (botCommand.indexOf("bot") < 0) {
                return
            }
            // Ignore the message posted by bot
            if (req.body.ownerId === req.body.body.creatorId) {
                console.log("Ignoring message posted by bot.");
                return
            }
            else if (CREATE_COMMANDS.includes(req.body.body.text)) {

                // Get details of the user that created the event
                let person = await teamUtil.getPerson(token, req.body.body.creatorId);

                // Create conversation between the bot and the user to send private message to the event creator
                let conversation = await teamUtil.createConversation(token, { members: [{ id: person.id }, { id: req.body.ownerId }] })

                //  Send a card to create event 
                await sendCard(token, await createEvent(req.body.body.groupId, req.body.body.creatorId, req.body.body.text), conversation.id);
            }
            else if (req.body.body.text === "bot help") {
                await sendMessage(token, "Hey, using me you can create and schedule events including sports events, Lunch, dinner or coffee events and concerts ", req.body.body.groupId)
            }
            else if (req.body.body.text === 'bot get details') {

                let results = await dbUtil.getEvents(req.body.body.creatorId)

                let events = results.rows.map((event) => {
                    const value = event['event_id'] || 'sample'
                    const title = event['event_name'] || 'Sample'
                    return { title, value }
                });
                let getDetailsCard = await getDetails(events);
                await sendCard(token, getDetailsCard, req.body.body.groupId);
            }
            else {
                await sendMessage(token, "I do not understand '" +
                    req.body.body.text +
                    "'", req.body.body.groupId)
            }

            res.json({ 'message': true }).status(200).end()
        }
    } catch (error) {
        console.log(error);
        res.json({ 'success': false }).status(500).end()
    }
})

/**
 * Route to handle adaptive card submission. 
 */
// This handler is called when a user submit data from an adaptive card
router.post('/interactive', async function (req, res) {

    console.log('Request bosy', req.body);

    const response = await dbUtil.findTokenFromAccountId(req.body.user.accountId);
    const token = response.rows[0];

    try {

        // Handle Create event action submitted from the card
        if (req.body.data.action === 'create_event') {

            // Get list of members from the team from which the create event was triggered
            let members = await teamUtil.getTeam(token, req.body.data.event_origin);

            // Add event entry to the event table in the DB
            let results = await dbUtil.createEvent(nanoid(), req.body.data, members.members)

            // Add card entry to the Cards table in the DB
            await dbUtil.createCard(token, req.body.card.id, req.body.user.accountId, req.body.conversation.id, results.rows[0])

            // Update the existing card with the details
            await updateCard(token, req.body.conversation.id, req.body.card.id, await updateEvent(results.rows[0]));

            // Send the invite cards to all the members to the team
            await teamUtil.notifyAttendees(token, results.rows[0])

            // Create a reminder to notify users later based on preference
            await schedularUtil.createReminder(req.body.data)
            res.json({ 'success': true }).status(200)
        }

        // Handle Edit event action from the card
        if (req.body.data.action === 'edit_event') {
            console.log('REQUEST BODY', req.body);
            let results = await dbUtil.updateEvent(req.body.data);

            let updateEventCard = await updateCard(token, req.body.conversation.id,
                req.body.card.id,
                await updateEvent(results.rows[0]));

            console.log('eventUpdate', results);
            res.json({ 'success': true }).status(200)
        }

        // 
        if (req.body.data.action === 'invitation') {

            let results = await dbUtil.updateRSVP(req.body.data, req.body.user.accountId);

            let event = await dbUtil.getEvent(req.body.data.event_id);

            console.log('req.body.data', req.body.data);
            let updateInvitationCard = await updateCard(token, req.body.conversation.id,
                req.body.card.id,
                editRSVP(event.rows[0], req.body.data));

            // console.log('Invitation update', results.rows[0]);
            console.log(req.body);
            res.json({ 'success': true }).status(200)
        }

        if (req.body.data.action === 'get_details') {
            let eventId = req.body.data.event

            let result = await dbUtil.getRSVPDetails(eventId);
            // await teamUtil.getAllAttendees(token, req.body.data.get_rsvp, result.rows[0])
            await updateCard(token, req.body.conversation.id, req.body.card.id, await eventDetails(result.rows[0]));

            console.log('RESULT',result.rows[0]);
            console.log('RESULT', `${result.rows[0].attendees.length} ${result.rows[0].attending.length} ${result.rows[0].not_attending.length} ${result.rows[0].maybe_attending.length}`);
            res.json({ 'success': true }).status(200)

        }

    } catch (error) {
        console.error(error);
        res.json({ 'success': false }).status(500)
    }

});


module.exports = router;