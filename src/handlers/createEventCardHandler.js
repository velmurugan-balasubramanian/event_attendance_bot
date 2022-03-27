
const teamUtil = require('../utils/team');
const { getTeamDetails } = require('../utils/team');

const dbUtil = require('../utils/db')
const { createEventEntry, createCardEntry } = require('../utils/db')
const { updateCard } = require('../utils/cards');
const { createReminder, createSendInvitationSchedule } = require('../utils/scheduler');
const { nanoid } = require('nanoid')


// Import Cards
const updateEvent = require('../cards/updateEvent');


createEventCardAction = async (cardbody, token) => {

    try {
        // Get list of members from the team from which the create event was triggered
        let members = await getTeamDetails(token, cardbody.data.event_origin);

        // Add event entry to the event table in the DB
        let event_id = nanoid()
        let results = await createEventEntry(event_id, cardbody.data, members.members)

        // Add card entry to the Cards table in the DB
        await createCardEntry(token, cardbody.card.id, cardbody.user.extId, cardbody.conversation.id, results.rows[0])

        // Update the existing card with the details
        await updateCard(token, cardbody.conversation.id, cardbody.card.id, await updateEvent(results.rows[0], cardbody.data));

        // Send the invite cards to all the members to the team
        await teamUtil.notifyAttendees(cardbody.data.bot_id, cardbody.data.event_type, token, results.rows[0])

        // Create Reminders
        // Create a first and second reminder to notify users later based on preference
        console.info(`Creating First Reminder for the event ${event_id}`)
        await createReminder(results.rows[0].event_id, cardbody.data.event_date, cardbody.data.event_start_time, cardbody.data.first_reminder, cardbody.data.timezone, cardbody.data.event_type, 'reminder', cardbody.data.bot_id);

        console.info(`Creating Second reminder for the event ${event_id}`)
        await createReminder(results.rows[0].event_id, cardbody.data.event_date, cardbody.data.event_start_time, cardbody.data.second_reminder, cardbody.data.timezone, cardbody.data.event_type, 'reminder', cardbody.data.bot_id);

        // Create Fomo reminder 
        console.info(`Creating FOMO reminder for the event ${event_id}`)
        await createReminder(results.rows[0].event_id, cardbody.data.event_date, cardbody.data.event_start_time, 300, cardbody.data.timezone, cardbody.data.event_type, 'fomo_reminder', cardbody.data.bot_id);

        // Create Bulk message Schedule
        console.info(`Creating a schedule a send invitations ${event_id}`)
        await createSendInvitationSchedule(results.rows[0].event_id, cardbody.data.timezone, cardbody.data.event_type, 'invitation', cardbody.data.bot_id)

        // Create check-in Reminder
        console.info(`Creating a schedule to send checkin cards for the ${event_id}`)
        await createReminder(results.rows[0].event_id, cardbody.data.event_date, cardbody.data.event_start_time, 0, cardbody.data.timezone, cardbody.data.event_type, 'checkin', cardbody.data.bot_id);

        return true
    } catch (error) {
        console.error(error);
        return false
    }
}

module.exports = {
    createEventCardAction: createEventCardAction
}