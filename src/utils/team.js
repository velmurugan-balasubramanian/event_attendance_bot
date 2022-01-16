const platform = require('./platform');


const getTeam = async (teamId) => {
    let response = await platform.get(`/restapi/v1.0/glip/groups/${teamId}`)
    return response.json();
}

const getPerson = async (accountId) => {
    let response = await platform.get(`/restapi/v1.0/glip/persons/${accountId}`)
    let person =  response.json();
    return person 
}

const createConversation = async(members) => {
    let response = await platform.post(`/restapi/v1.0/glip/conversations`, members)
    return response.json()
}

module.exports = {
    getTeam: getTeam, 
    getPerson:getPerson, 
    createConversation:createConversation
}