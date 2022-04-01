const platform = require('./platform');
const { sendCard, sendMessage } = require('./cards');
const sendInvitation = require('../cards/sendInvitation')



/**
 * Get Team Details for a given team ID 
 * @param {*} token token object to make API request to the platforms
 * @param {*} teamId Team ID to fetch the team details from.
 * @returns Team Object
 */
const getTeamDetails = async (token, teamId) => {

    try {
        await platform.auth().setData(token);
        let response = await platform.get(`/restapi/v1.0/glip/groups/${teamId}`)
        return response.json();
    } catch (error) {
        console.error('Unable to get Team members')
        console.error(error)
    }

}


/**
 * Get User/Extenstion details of the given extension ID
 * @param {*} token token object to make API request to the platforms
 * @param {*} accountId Id for the profile to get details
 * @returns 
 */
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

/**
 * 
 * @param {*} token token object to make API request to the platforms
 * @param {*} members 
 * @returns 
 */
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

const checkIsDM = async (token, ownerId, creatorId, groupId) => {
    try {

        let conversation = await createConversation(token, {
            members: [
                {
                    id: ownerId
                },
                {
                    id: creatorId
                }
            ]
        })

        if (conversation.id === groupId) {
            return true
        }
    } catch (error) {

    }
}

/**
 * 
 * @param {*} bot_id 
 * @param {*} event_type 
 * @param {*} token token object to make API request to the platforms
 * @param {*} event 
 * @returns 
 */
const notifyAttendees = async (bot_id, event_type, token, event) => {

    // console.log("Token", event);


    try {
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

/**
 * 
 * @param {*} token token object to make API request to the platforms
 * @param {*} rsvp 
 * @param {*} status 
 */
const getAllAttendees = async (token, rsvp, status) => {

    try {

        let list;
        if (rsvp === 'yes' && status.attending.length > 0) list = status.attending
        if (rsvp === 'no' && status.not_attending.length > 0) list = status.not_attending
        if (rsvp === 'all' && status.attendees.length > 0) list = status.attendees


        list.forEach(async (personID, idx) => {
            let person = await getPerson(token, personID);
            if (person) {
                // console.log('Person', person);
            }

        })

    } catch (error) {
        console.error('Unable to get all attendees');
        console.error(error);
    }

}

const getTeams = async (token) => {
    try {

        console.time('get teams')
        await platform.auth().setData(token);
        let response = await platform.get(`/restapi/v1.0/glip/teams?recordCount=250`)
        let teams = response.json();
        
        // console.log('Teams', teams);
        let teamSelection = teams.records.map((team) => {
                const value = team['id'] || 'sample'
                const title = team['name'] || 'Sample'
                return { title, value }

        });
        console.timeEnd('get teams')
        return teamSelection

    } catch (error) {

        console.error(`Unable to get team lists`);
        console.error(error);

    }
}

module.exports = {
    getTeamDetails: getTeamDetails,
    getPerson: getPerson,
    createConversation: createConversation,
    notifyAttendees: notifyAttendees,
    getAllAttendees: getAllAttendees,
    checkIsDM: checkIsDM,
    getTeams: getTeams
}