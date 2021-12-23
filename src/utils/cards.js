// Post a message to a chat
const platform = require('./platform');



const sendMessage = (msg, group) => {
    console.log("Posting response to group: " + group);
    platform.post('/restapi/v1.0/glip/chats/' + group + '/posts', {
        "text": msg
    }).catch(function (e) {
        console.log(e)
    });
}

const sendCard = (card, group) => {
    console.log("Posting card to group: " + group);
    platform.post('/restapi/v1.0/glip/chats/' + group + '/adaptive-cards', card)
        .then((data) => {
            console.log('New Card posted');
        })
        .catch(function (e) {
            console.log(e)
        });
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
    updateCard:updateCard

}