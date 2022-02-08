
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

const getEvent = async (event_id) => {
    const dbQuery = "SELECT * from events where event_id = $1"
    const dbValubes = [event_id]
    const dbResults = await db.query(dbQuery, dbValubes);
    return dbResults;
}

const updateEvent = async (event) => {

    console.log('Update event', event);
    const dbQuery = "UPDATE events SET event_name = $1, event_date = $2, event_start_time = $3, event_end_time = $4 where event_id = $5 returning *"
    const dbValubes = [event.event_name, event.event_date, event.event_start_time, event.event_end_time, event.event_id]
    const dbResults = await db.query(dbQuery, dbValubes);
    return dbResults;
}

// create table cards(card_id varchar(1000) primary key, team_id varchar(1000), event_id varchar(1000), receiver_user_id varchar(1000), conversation_id varchar(1000), card_action varchar(100))

const createCard = async (card_id, receiver_id, conversation_id, event) => {
    const dbQuery = "INSERT INTO cards (card_id, team_id, event_id, receiver_user_id, conversation_id, card_action  ) values ($1, $2, $3, $4,$5, $6) returning *"
    const dbValubes = [card_id, event.event_origin, event.event_id, receiver_id, conversation_id, event.action];
    const dbResults = await db.query(dbQuery, dbValubes);
    return dbResults;
}

const updateRSVP = async (event, user_id) => {

    if (event.rsvp === 'yes') {

        const dbQuery = "UPDATE events set not_attending = array_remove(not_attending,$1), attending = array_append(attending, $1 ) where event_id = $2 returning *"
        const dbValubes = [user_id, event.event_id];
        const dbResults = await db.query(dbQuery, dbValubes);
        return dbResults;
    }
    if (event.rsvp === 'no') {

        const dbQuery = "UPDATE events set attending = array_remove(attending, $1), not_attending = array_append(not_attending, $1 ) where event_id = $2 returning *"
        const dbValubes = [user_id, event.event_id];
        const dbResults = await db.query(dbQuery, dbValubes);
        return dbResults;
    }
    // const dbQuery = "UPDATE events set attending = array_append(attending, $1 ) where event_id = $2 returning *"

}

const getTeamMemebers = async (teamID) => {
    const dbQuery = "select memebers from teams where team_id = $1"
    const dbValubes = [teamID];
    const dbResults = await db.query(dbQuery, dbValubes)

    console.log('dbResults', dbResults);
}

const saveToken = async (tokenData) => {
    const dbQuery = "INSERT INTO tokens (token_type, access_token, expires_in, refresh_token, refresh_token_expires_in) values ($1, $2, $3, $4, $5) returning *"
    const dbValues = [tokenData.token_type, tokenData.access_token, tokenData.expires_in, tokenData.refresh_token, tokenData.refresh_token_expires_in, tokenData.expire_time, tokenData.refresh_token_expire_time]
    const dbResults = await db.query(dbQuery, dbValues);
    console.log('dbResults', dbResults);

}

const getToken = async () => {
    const dbQuery = "SELECT * FROM tokens"
    const dbResults = await db.query(dbQuery);
    // console.log('dbResults', dbResults);
    return dbResults
}

module.exports = {
    create: create,
    createTeam: createTeam,
    createEvent: createEvent,
    getEvent: getEvent,
    getTeamMemebers: getTeamMemebers,
    createCard: createCard,
    updateEvent: updateEvent,
    updateRSVP: updateRSVP,
    saveToken: saveToken,
    getToken:getToken
}


