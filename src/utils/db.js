
const db = require('../db')

const create = async (card_id, conversation_id, creator_id, creator_email, ticket_id, event_id) => {

    const dbQuery = "INSERT INTO participant (card_id, conversation_id, creator_id, creator_email, ticket_id, event_id) values ($1, $2, $3, $4,$5, $6) returning *"
    const dbValubes = [card_id, conversation_id, creator_id, creator_email, ticket_id, event_id];
    const dbResults = await db.query(dbQuery, dbValubes)

    console.log('dbResults', dbResults);
    return dbResults;
}

// create table teams ( team_id varchar(1000) Primary key, team_name varchar(1000), description varchar(1000), status boolean, memebers varchar(100) [], is_public boolean, created_at timestamptz, modified_at timestamptz)
const createTeam = async (team) => {
    const dbQuery = "INSERT INTO teams (team_id, team_name, description, status, memebers, is_public, created_at , modified_at  ) values ($1, $2, $3, $4,$5, $6, $7, $8) returning *"
    const dbValubes = [team.id, team.name , team.description , team.status , team.members , team.isPublic , team.creationTime , team.lastModifiedTime];
    const dbResults = await db.query(dbQuery, dbValubes)

    return dbResults;
}


module.exports = {
    create:create,
    createTeam:createTeam
}


