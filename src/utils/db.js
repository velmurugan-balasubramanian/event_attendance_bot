
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
    const dbValubes = [team.id, team.name, team.description, team.status, team.members, team.isPublic, team.creationTime, team.lastModifiedTime];
    const dbResults = await db.query(dbQuery, dbValubes)

    return dbResults;
}

// create table events(event_id varchar(1000) primary key, event_name varchar(1000), event_origin varchar(1000),event_owner varchar(1000), attendees varchar(100) [], attending varchar(100) [], not_attending varchar(100)[], event_date date, event_start_time time, event_end_time time )
const createEvent = async (event_id, event, members) => {
    const dbQuery = "INSERT INTO events (event_id, event_name, event_origin, event_owner, attendees, attending, not_attending , event_date, event_start_time, event_end_time  ) values ($1, $2, $3, $4,$5, $6, $7, $8, $9, $10) returning *"
    const dbValubes = [event_id, event.event_name, event.event_origin, event.event_owner, members, [], [], event.event_date, event.event_start_time, event.event_end_time];
    const dbResults = await db.query(dbQuery, dbValubes);
    return dbResults;
}

const getTeamMemebers = async (teamID) => {
    const dbQuery = "select memebers from teams where team_id = $1"
    const dbValubes = [teamID];
    const dbResults = await db.query(dbQuery, dbValubes)

    console.log('dbResults', dbResults);
}
module.exports = {
    create: create,
    createTeam: createTeam,
    createEvent: createEvent,
    getTeamMemebers: getTeamMemebers
}


