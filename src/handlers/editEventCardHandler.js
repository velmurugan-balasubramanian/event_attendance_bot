const { updateCard } = require('../utils/cards')
const { updateEventInDB, getAllSchedules } = require('../utils/db')
const { updateSchdules } = require('../utils/scheduler')
const updateEventCard = require('../cards/updateEvent');

/**
 * Function to handle to edit_event action from the card
 * @param {*} cardBody  Data submitted by the User 
 * @param {*} token 
 * @returns 
 */
const editEventAction = async (cardBody, token) => {
    try {
        console.info(`Editing event ${cardBody.card.event_id}`, cardBody);
        let results = await updateEventInDB(cardBody.data);

        let schedules = await getAllSchedules(cardBody.data.event_id)


        // Update schedules to the new data
        await updateSchdules(schedules, cardBody)



        let updatedCard = await updateEventCard(results.rows[0], cardBody.data)
        await updateCard(token, cardBody.conversation.id, cardBody.card.id, updatedCard);
        return true

    } catch (error) {
        console.error(`Unbale to Edit the event`);
        console.error(error);
        return false
    }
}


module.exports = {
    editEventAction: editEventAction
}