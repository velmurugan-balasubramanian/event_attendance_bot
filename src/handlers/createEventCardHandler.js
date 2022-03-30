
const teamUtil = require('../utils/team');
const { getTeamDetails } = require('../utils/team');

const dbUtil = require('../utils/db')
const { createEventEntry, createCardEntry } = require('../utils/db')
const { updateCard } = require('../utils/cards');
const { createReminder } = require('../utils/scheduler');
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
        // await createCardEntry(cardbody.card.id, cardbody.user.extId, cardbody.conversation.id, results.rows[0])


        await Promise.all([
            createReminder(results.rows[0].event_id, new Date(`${cardbody.data.event_date} ${cardbody.data.event_start_time}`), cardbody.data.first_reminder, cardbody.data.timezone, cardbody.data.event_type, 'reminder', cardbody.data.bot_id),
            createReminder(results.rows[0].event_id, new Date(`${cardbody.data.event_date} ${cardbody.data.event_start_time}`), cardbody.data.first_reminder, cardbody.data.timezone, cardbody.data.event_type, 'reminder', cardbody.data.bot_id),
            createReminder(results.rows[0].event_id, new Date(`${cardbody.data.event_date} ${cardbody.data.event_start_time}`), 300, cardbody.data.timezone, cardbody.data.event_type, 'fomo_reminder', cardbody.data.bot_id),
            createReminder(results.rows[0].event_id, new Date(`${cardbody.data.event_date} ${cardbody.data.event_start_time}`), 0, cardbody.data.timezone, cardbody.data.event_type, 'checkin', cardbody.data.bot_id),
            createReminder(results.rows[0].event_id, new Date(new Date().toLocaleString('en-US', { timeZone: cardbody.data.timezone })), -2, cardbody.data.timezone, cardbody.data.event_type, 'invitation', cardbody.data.bot_id)
        ]);

        // Update the existing card with the details
        let updatedEventCard = await updateEvent(results.rows[0], cardbody.data)
        await updateCard(token, cardbody.conversation.id, cardbody.card.id, updatedEventCard);

        return true
    } catch (error) {
        console.error(error);
        return false
    }
}

module.exports = {
    createEventCardAction: createEventCardAction
}