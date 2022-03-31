
const { getTeamDetails } = require('../utils/team');
const { createEventEntry, createCardEntry } = require('../utils/db')
const { updateCard } = require('../utils/cards');
const { createReminder, createSchedules } = require('../utils/scheduler');
const { nanoid } = require('nanoid')


// Import Cards
const updateEvent = require('../cards/updateEvent');


createEventCardAction = async (cardbody, token) => {

    try {

        // Get list of members from the team from which the create event was triggered
        let members = await getTeamDetails(token, cardbody.data.event_origin);

        // Add event entry to the event table in the DB
        let event_id = nanoid()
        let event = await createEventEntry(event_id, cardbody.data, members.members)

        await createSchedules(event.event_id, cardbody)

        // Update the existing card with the details
        let updatedEventCard = await updateEvent(event, cardbody.data)
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