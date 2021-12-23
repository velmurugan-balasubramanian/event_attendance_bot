
const db = require('../db')

const create = async (card_id, conversation_id, creator_id, creator_email, ticket_id, event_id) => {

    const dbQuery = "INSERT INTO participant (card_id, conversation_id, creator_id, creator_email, ticket_id, event_id) values ($1, $2, $3, $4,$5, $6) returning *"
    const dbValubes = [card_id, conversation_id, creator_id, creator_email, ticket_id, event_id];
    const dbResults = await db.query(dbQuery, dbValubes)

    console.log('dbResults', dbResults);
    return dbResults;
}


module.exports = {
    create:create
}


