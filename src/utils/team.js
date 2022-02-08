const platform = require('./platform');
const { sendCard, sendMessage } = require('./cards');

const rsvp = require('../cards/rsvp');
const sendInvitation = require('../cards/sendInvitation')



const getTeam = async (teamId) => {
    let response = await platform.get(`/restapi/v1.0/glip/groups/${teamId}`)
    return response.json();
}

const getPerson = async (accountId) => {
    let response = await platform.get(`/restapi/v1.0/glip/persons/${accountId}`)
    let person = response.json();
    return person
}

const createConversation = async (members) => {
    let response = await platform.post(`/restapi/v1.0/glip/conversations`, members)
    return response.json()
}

// change function name to send RSVP cards 
const notifyAttendees = async (event) => {

    try {
        event.attendees.forEach(async (member) => {
            let conversation = await createConversation(
                {
                    members: [
                        {
                            id: member
                        },
                        {
                            id: process.env.BOT_ID
                        }
                    ]
                }
            )

            // await sendCard(rsvp(event.event_id), conversation.id)
            await sendCard(sendInvitation(event), conversation.id)
            await sendMessage("BUlk message", conversation.id);
        });
        return true
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getTeam: getTeam,
    getPerson: getPerson,
    createConversation: createConversation,
    notifyAttendees: notifyAttendees
}