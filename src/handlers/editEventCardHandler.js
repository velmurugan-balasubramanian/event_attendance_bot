const { updateCard } = require('../utils/cards')
const dbUtil = require('../utils/db')
const updateEvent = require('../cards/updateEvent');


const editEventAction = async (cardBody, token) => {
    try {
        // console.log('cardBody', cardBody);
        let results = await dbUtil.updateEvent(cardBody.data);
        await updateCard(token, cardBody.conversation.id, cardBody.card.id, await updateEvent(results.rows[0], cardBody.data));
        return true

    } catch (error) {
        console.error(error);
        return false
    }
}


module.exports = {
    editEventAction: editEventAction
}