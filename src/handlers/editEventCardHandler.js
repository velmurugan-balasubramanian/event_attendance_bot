const { updateCard } = require('../utils/cards')
const { updateEventInDB } = require('../utils/db')
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