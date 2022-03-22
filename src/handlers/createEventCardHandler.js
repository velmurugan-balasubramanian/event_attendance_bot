
const teamUtil = require('../utils/team');
const dbUtil = require('../utils/db')
const { updateCard } = require('../utils/cards');
const schedularUtil = require('../utils/scheduler');
const { nanoid } = require('nanoid')


// Import Cards
const updateEvent = require('../cards/updateEvent');


createEventCardAction = async (cardbody, token) => {
    console.log('Crd body', cardbody);

    try {
        // Get list of members from the team from which the create event was triggered
        let members = await teamUtil.getTeam(token, cardbody.data.event_origin);

        // Add event entry to the event table in the DB
        let results = await dbUtil.createEvent(nanoid(), cardbody.data, members.members)

        // Add card entry to the Cards table in the DB
        await dbUtil.createCard(token, cardbody.card.id, cardbody.user.accountId, cardbody.conversation.id, results.rows[0])

        // Update the existing card with the details
        await updateCard(token, cardbody.conversation.id, cardbody.card.id, await updateEvent(results.rows[0], cardbody.data));

        // Send the invite cards to all the members to the team
        await teamUtil.notifyAttendees(cardbody.data.bot_id,cardbody.data.event_type ,token, results.rows[0])

        // Create a reminder to notify users later based on preference
        console.info('Creating First Reminder')
        await schedularUtil.createReminder(cardbody.data.event_id, cardbody.data.event_date, cardbody.data.event_start_time, cardbody.data.first_reminder, cardbody.data.timezone,'reminder');

        // Create second reminder
        console.info('Creating Second reminder')
        await schedularUtil.createReminder(cardbody.data.event_id, cardbody.data.event_date, cardbody.data.event_start_time, cardbody.data.second_reminder, cardbody.data.timezone,'reminder');

        // Create Fomo reminder 



        // Create Checkin reminder, 

        return true
    } catch (error) {
        console.error(error);
        return false
    }
}

module.exports = {
    createEventCardAction: createEventCardAction
}