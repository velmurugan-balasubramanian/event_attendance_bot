const router = require('express').Router()

// Import Handlers
const { GroupJoined } = require('../handlers/groupJoinedHandler')
const { postAdded } = require('../handlers/postAddedHandler')
const { createEventCardAction } = require('../handlers/createEventCardHandler')
const { editEventAction } = require('../handlers/editEventCardHandler')
const { invitationAction } = require('../handlers/invitationHandler')
const { checkinAction } = require('../handlers/checkInHandler')

// Import Utils
const dbUtil = require('../utils/db')
const { findTokenFromDB } = require('../utils/db')

const { renewSubscription } = require('../utils/subscription');
const { updateCard } = require('../utils/cards')
const eventDetails = require('../cards/eventDetail')

router.get('/test', async (req, res) => {
    res.json({ message: 'ok' }).status(200).end()
})

router.post('/callback', async (req, res) => {

    try {

        // Get owner_id from the request body to get the token
        const response = await findTokenFromDB(req.body.ownerId);
        const token = response.rows[0];

        let validationToken = req.get('Validation-Token');

        if (validationToken) {
            console.log('Verifying webhook.');
            res.setHeader('Validation-Token', validationToken);
            res.json({ 'success': true }).status(200).end()
            return
        }
        if (req.body.event == "/restapi/v1.0/subscription/~?threshold=60&interval=15") {
            await renewSubscription(req.body.subscriptionId);
            res.json({ 'success': true }).status(200).end();
            return
        }
        if (req.body.body.eventType === "GroupJoined") {
            let isActionSuccess = await GroupJoined(token, req.body.body.id)

            if (isActionSuccess) {
                res.json({ 'success': true }).status(200).end()
                return
            }

            if (!isActionSuccess) {
                res.json({ 'success': false }).status(500).end()
                return
            }


        }
        if (req.body.body.eventType === "PostAdded") {

            let isActionSuccess = await postAdded(req.body.body.text || '', req.body.ownerId, req.body.body.creatorId, req.body.body.groupId, token)

            if (isActionSuccess) {
                res.json({ 'message': true }).status(200).end()
                return
            }

            if (!isActionSuccess) {
                res.json({ 'success': false }).status(500).end()
                return
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ 'success': false }).status(500).end()
    }
})

/**
 * Route to handle adaptive card submission. 
 */
router.post('/interactive', async function (req, res) {

    try {

        const response = await dbUtil.findTokenFromSubscriptionId(req.body.data.bot_id);
        const token = response.rows[0];

        // Handle Create event action submitted from the card
        if (req.body.data.action === 'create_event') {

            let isActionSuccess = await createEventCardAction(req.body, token)


            if (isActionSuccess) {
                res.json({ 'success': true }).status(200).end()
                return
            }

            if (!isActionSuccess) {
                res.json({ 'success': false }).status(500).end()
                return
            }
        }

        // Handle Edit event action from the card
        if (req.body.data.action === 'edit_event') {
            let isActionSuccess = await editEventAction(req.body, token)

            if (isActionSuccess) {
                res.json({ 'success': true }).status(200);
                return
            }
            if (!isActionSuccess) {
                res.json({ 'success': false }).status(500);
                return
            }

        }

        // 
        if ((req.body.data.action === 'invitation') || (req.body.data.action === 'edit_rsvp')) {

            let isActionSuccess = await invitationAction(req.body, token)

            if (isActionSuccess) {
                res.json({ 'success': true }).status(200);
                return
            }
            if (!isActionSuccess) {
                res.json({ 'success': false }).status(500);
                return
            }

        }

        if (req.body.data.action === 'get_details') {
            let eventId = req.body.data.event

            let result = await dbUtil.getRSVPDetails(eventId);
            // await teamUtil.getAllAttendees(token, req.body.data.get_rsvp, result.rows[0])
            await updateCard(token, req.body.conversation.id, req.body.card.id, await eventDetails(result.rows[0]));

            // console.log('RESULT', result.rows[0]);
            // console.log('RESULT', `${result.rows[0].attendees.length} ${result.rows[0].attending.length} ${result.rows[0].not_attending.length} ${result.rows[0].maybe_attending.length}`);
            res.json({ 'success': true }).status(200)

        }
        if (req.body.data.action === 'checkin') {
            await checkinAction(req.body, token)
            res.json({ 'success': false }).status(500)
        }

    } catch (error) {
        console.error(error);
        res.json({ 'success': false }).status(500)
    }

});


module.exports = router;