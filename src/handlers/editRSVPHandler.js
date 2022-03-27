

const editRSVPAction = async (cardBody, token) => {
    try {

        let results = await dbUtil.updateRSVP(cardBody.data, cardBody.user.accountId);

        let event = await dbUtil.getEvent(cardBody.data.event_id);

        // console.log('cardBody.data', cardBody.data);
        let updateInvitationCard = await updateCard(token, cardBody.conversation.id, cardBody.card.id, editRSVP(event.rows[0], cardBody.data));
        return true

    } catch (error) {
        console.error(error);
        return false
    }
}
module.exports = {
    editRSVPAction: editRSVPAction
}