
const { createTeamEntry } = require('../utils/db')
const { getTeamDetails } = require('../utils/team')


/**
 * Function to Handle Group joined event emitted by the bot 
 * @param {*} token token object to make API request to the platforms
 * @param {*} teamId Team ID of the group to which the Bot Joined the conversation
 * @returns 
 */
const GroupJoined = async (token, teamId) => {

    try {
        
        // Get Team details from the group/Conversation ID
        let teamDetails = await getTeamDetails(token, teamId)

        // Create a DB entry with team details in the team table
        let dbResult = await createTeamEntry(teamDetails)

        return true
    } catch (error) {
        console.error(error);
        return false
    }

}

module.exports = {
    GroupJoined: GroupJoined,
}