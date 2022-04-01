const { sendMessage, sendCard } = require('../utils/cards')
const dbUtil = require('../utils/db')
const { getPerson, createConversation, checkIsDM, getTeams } = require('../utils/team')
const { getEventsfromDB } = require('../utils/db')


// Import cards
const getDetails = require('../cards/getDetails');
const createEvent = require('../cards/createEvent');
const chooseEvent = require('../cards/chooseTeam');


// List of commands the bot can accept
const CREATE_COMMANDS = [
    "create sports event",
    "create lunch event",
    "create a lunch event",
    "create lunch event",
    "create a dinner event",
    "create dinner event",
    "create a concert event",
    "create concert event",
    "create concert",
]

/**
 * Function to Handle post added action
 * @param {*} botCommand Command or the message issues by the user
 * @param {*} ownerId  OwnerId or bot_id
 * @param {*} creatorId Creator of the post or the person who sent the message to the group
 * @param {*} groupId Conversation ID of the team from which the conversation was initiated
 * @param {*} token 
 * @returns 
 */
const postAdded = async (botCommand = '', ownerId, creatorId, groupId, token) => {
    let isDM = false;
    try {
        console.log('botCommand', botCommand);
        // Ignore the message posted by bot
        if (ownerId === creatorId) {
            return
        }
        else if (CREATE_COMMANDS.includes(botCommand)) {
            console.info("Found bot command")

            isDM = await checkIsDM(token, ownerId, creatorId, groupId)

            if (isDM) {
                console.info(`Going DM route`)
                let userTeams = await getTeams()
                // console.info('Teams found', userTeams)
                let chooseEventCard = await chooseEvent(userTeams, ownerId, botCommand)
                await sendCard(token, chooseEventCard, groupId);
                return
            }
            else {
                // Get details of the user that created the event
                let person = await getPerson(token, creatorId);

                // // Create conversation between the bot and the user to send private message to the event creator
                let conversation = await createConversation(token, { members: [{ id: person.id }, { id: ownerId }] })

                let createEventCard = await createEvent(ownerId, groupId, creatorId, botCommand)

                // //  Send a card to the user to create event 
                await sendCard(token, createEventCard, conversation.id);
                return
            }
        }
        else if (botCommand === "help") {
            await sendMessage(token, `Hey  I am **E.V.A.N.S**, I can help you create and plan fun events with your team through Ringcentral Team Messaging, You can mention me and  use one of the following messages to start, 
            * create sports event
            * create lunch event
            * create dinner event
            * create concert event
To Know more about me, Click [here](#).`, groupId)
        }
        else if (botCommand === 'get details') {

            let results = await dbUtil.getEventsfromDB(creatorId)

            let events = results.rows.map((event) => {
                const value = event['event_id'] || 'sample'
                const title = event['event_name'] || 'Sample'
                return { title, value }
            });
            let getDetailsCard = await getDetails(events, ownerId);
            await sendCard(token, getDetailsCard, groupId);
        }
        else {
            await sendMessage(token, "I do not understand '" + botCommand + "'", groupId)
        }

        return true
    } catch (error) {
        console.error(error);
        return false
    }
}

module.exports = {
    postAdded: postAdded
}