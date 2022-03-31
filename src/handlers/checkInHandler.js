
const { updateAttendanceInDB, getEventFromDB } = require('../utils/db')
const { updateCard } = require('../utils/cards');
const checkInCard = require('../cards/checkIn')

const checkinAction = async (card, token) => {
    try {
        await updateAttendanceInDB(card.user.extId, card.data)
        let result = await getEventFromDB(card.data.event_id);
        let event = result.rows[0]

        let updatedCheckInCard = await checkInCard(event.event_name)
        await updateCard(token, cardbody.conversation.id, cardbody.card.id, updatedCheckInCard);

    } catch (error) {
        console.error('Unable to checkin to the event');
        console.error(error);
    }
}
module.exports = {
    checkinAction: checkinAction
}