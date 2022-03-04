// Post a message to a chat
const platform = require('./platform');



const sendMessage = async (msg, group) => {

    try {
        await platform.post('/restapi/v1.0/glip/chats/' + group + '/posts', {
            "text": msg
        })

    } catch (error) {
        console.log('Unable to Send message to the group');
        console.log(e)
    }
}

const sendCard = async (card, group) => {
    console.log("CARD", JSON.stringify(card.body));
    try {
        console.log("Posting card to group: " + group);
        let data = await platform.post('/restapi/v1.0/glip/chats/' + group + '/adaptive-cards', card);
        return data
    } catch (error) {
        console.error('Unbale to send card');
        console.error(error);
        return error
    }

}

const updateCard = (group, card, content) => {
    console.log("Updating card...");
    platform.put('/restapi/v1.0/glip/adaptive-cards/' + card, content)
        .catch(function (e) {
            console.log(e)
        });

}

module.exports = {
    sendMessage: sendMessage,
    sendCard: sendCard,
    updateCard: updateCard

}