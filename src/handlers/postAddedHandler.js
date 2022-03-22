const { sendMessage, sendCard, updateCard } = require('../utils/cards')
const teamUtil = require('../utils/team')
const dbUtil = require('../utils/db')

const getDetails = require('../cards/getDetails');

const createEvent = require('../cards/createEvent');


const CREATE_COMMANDS = [
    "bot create sports event",
    "bot create lunch event",
    "bot create a lunch event",
    "bot create a dinner event",
    "bot create dinner event",
    "bot create a concert event",
    "bot create concert event",
    "bot create concert",
]


const postAdded = async (botCommand = '', ownerId, creatorId, groupId, token) => {

    try {

        if (botCommand.indexOf("bot") < 0) {
            return
        }
        // Ignore the message posted by bot
        if (ownerId === creatorId) {
            // console.log("Ignoring message posted by bot.");
            return
        }
        else if (CREATE_COMMANDS.includes(botCommand)) {
            console.info("Found bot command")
            // Get details of the user that created the event
            let person = await teamUtil.getPerson(token, creatorId);

            // Create conversation between the bot and the user to send private message to the event creator
            let conversation = await teamUtil.createConversation(token, { members: [{ id: person.id }, { id: ownerId }] })

            //  Send a card to create event 
            await sendCard(token, await createEvent(ownerId, groupId, creatorId, botCommand), conversation.id);
        }
        else if (botCommand === "bot help") {
            await sendMessage(token, "Hey, using me you can create and schedule events including sports events, Lunch, dinner or coffee events and concerts ", req.body.body.groupId)
        }
        else if (botCommand === 'bot get details') {

            let results = await dbUtil.getEvents(creatorId)

            let events = results.rows.map((event) => {
                const value = event['event_id'] || 'sample'
                const title = event['event_name'] || 'Sample'
                return { title, value }
            });
            let getDetailsCard = await getDetails(events, ownerId);
            await sendCard(token, getDetailsCard, groupId);
        }
        else {
            await sendMessage(token, "I do not understand '" +
                botCommand +
                "'", groupId)
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