
const { updateAttendanceInDB } = require('../utils/db')
const checkinAction = async (card, token) => {
    try {
        await updateAttendanceInDB(card.user.extId, card.data)
    } catch (error) {
        console.error('Unable to checkin to the event');
        console.error(error);
    }

}
module.exports = {
    checkinAction: checkinAction
}