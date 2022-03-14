// Post a message to a chat
const platform = require('./platform');



const sendMessage = async (token, msg, group) => {

    try {
        await platform.auth().setData(token);
        await platform.post('/restapi/v1.0/glip/chats/' + group + '/posts', {
            "text": msg
        })

    } catch (error) {
        console.log('Unable to Send message to the group');
        console.log(error)
    }
}

const sendCard = async (token, card, group) => {
    try {
        console.log("Posting card to group: " + group);
        await platform.auth().setData(token);
        let data = await platform.post('/restapi/v1.0/glip/chats/' + group + '/adaptive-cards', card);
        return data
    } catch (error) {
        console.error('Unbale to send card');
        console.error(error);
        return error
    }

}

const updateCard = async (token, group, card, content) => {
    
    console.log("Updating card...");
    platform.auth().setData(token);
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