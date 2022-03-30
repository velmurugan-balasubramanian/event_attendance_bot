const dbUtil = require('../utils/db')
const { updateRSVPInDB, getEventFromDB } = require('../utils/db')
const { updateCard } = require('../utils/cards')
const editRSVP = require('../cards/updateRSVP');



const invitationAction = async (cardBody, token) => {
    try {

        let results = await updateRSVPInDB(cardBody.data, cardBody.user.extId);

        let event = await getEventFromDB(cardBody.data.event_id);

        let updateInvitationCard = await editRSVP(event.rows[0], cardBody.data)
        await updateCard(token, cardBody.conversation.id, cardBody.card.id, updateInvitationCard);
        return true

    } catch (error) {
        console.error(`Unable to complete the invitation action`);
        console.error(error);
        return false
    }
}


module.exports = {
    invitationAction: invitationAction
}