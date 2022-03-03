const platform = require('./platform');
const { sendCard, sendMessage } = require('./cards');

const rsvp = require('../cards/rsvp');
const sendInvitation = require('../cards/sendInvitation')



const getTeam = async (teamId) => {
    console.log('TEAM ID', teamId);
    try {
        let response = await platform.get(`/restapi/v1.0/glip/groups/${teamId}`)
        return response.json();
    } catch (error) {
        console.error('Unable to get Team members')
        console.error(error)
    }

}

const getPerson = async (accountId) => {

    console.log('Account ID', accountId);

    try {
        let response = await platform.get(`/restapi/v1.0/glip/persons/${accountId}`)
        let person = response.json();
        return person
    } catch (error) {
        console.error(`Unable to get the user details of the User ${accountId}`);
        console.error(error);
    }

}

const createConversation = async (members) => {
    try {
        let response = await platform.post(`/restapi/v1.0/glip/conversations`, members)
        return response.json()
    } catch (error) {

        console.error(`Unable to create a conversation`);
        console.error(error);
    }

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

// const getTimeZones = async () => {
//     try {
//         let response = await platform.get('')
//     } catch (error) {
        
//     }
// }


module.exports = {
    getTeam: getTeam,
    getPerson: getPerson,
    createConversation: createConversation,
    notifyAttendees: notifyAttendees
}