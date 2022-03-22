
const dbUtil = require('../utils/db')
const teamUtil = require('../utils/team')

const GroupJoined = async (token, teamId) => {

    try {
        // Get Team details from the conversation ID
        let teamDetails = await teamUtil.getTeam(token, teamId)

        // Create a DB entry with team details in the team table
        let dbResult = await dbUtil.createTeam(teamDetails)

        // console.log('dbResult', dbResult);
        return true
    } catch (error) {
        console.error(error);
        return false
    }

}

module.exports = {
    GroupJoined: GroupJoined,
}