const platform = require('./platform');
const { sendCard, sendMessage } = require('./cards');
const sendInvitation = require('../cards/sendInvitation')



const getTeam = async (token, teamId) => {

    try {
        await platform.auth().setData(token);
        let response = await platform.get(`/restapi/v1.0/glip/groups/${teamId}`)
        return response.json();
    } catch (error) {
        console.error('Unable to get Team members')
        console.error(error)
    }

}

const getPerson = async (token, accountId) => {

    try {

        await platform.auth().setData(token);
        let response = await platform.get(`/restapi/v1.0/glip/persons/${accountId}`)
        let person = response.json();
        return person
    } catch (error) {
        console.error(`Unable to get the user details of the User ${accountId}`);
        console.error(error);
    }

}

const createConversation = async (token, members) => {
    try {
        await platform.auth().setData(token);
        let response = await platform.post(`/restapi/v1.0/glip/conversations`, members)
        return response.json()

    } catch (error) {

        console.error(`Unable to create a conversation`);
        console.error(error);

    }

}

// change function name to send RSVP cards 
const notifyAttendees = async (bot_id, event_type, token, event) => {

    console.log("Token", event);


    try {
        console.log('event.attendees', event.attendees);
        event.attendees.forEach(async (member) => {
            let conversation = await createConversation(token,
                {
                    members: [
                        {
                            id: member
                        },
                        {
                            id: bot_id
                        }
                    ]
                }
            )

            // await sendCard(rsvp(event.event_id), conversation.id)
            await sendCard(token, sendInvitation(bot_id, event_type, event), conversation.id)
            // await sendMessage(token, "BUlk message", conversation.id);
        });
        return true
    } catch (error) {
        console.error(error);
    }
}


const getAllAttendees = async (token, rsvp, status) => {

    try {

        let list;
        if (rsvp === 'yes' && status.attending.length > 0) list = status.attending
        if (rsvp === 'no' && status.not_attending.length > 0) list = status.not_attending
        if (rsvp === 'all' && status.attendees.length > 0) list = status.attendees

        console.log('List', list);

        list.forEach(async (personID, idx) => {
            let person = await getPerson(token, personID);
            if (person) {
                console.log('Person', person);
            }

        })

    } catch (error) {
        console.error('Unable to get all attendees');
        console.error(error);
    }

}

module.exports = {
    getTeam: getTeam,
    getPerson: getPerson,
    createConversation: createConversation,
    notifyAttendees: notifyAttendees,
    getAllAttendees: getAllAttendees
}