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
    const dbQuery = "INSERT INTO teams (team_id, team_name, description, status, memebers, is_public, created_at , modified_at  ) values ($1, $2, $3, $4,$5, $6, $7, $8) ON CONFLICT (team_id) DO NOTHING returning *"
    const dbValubes = [team.id, team.name, team.description, team.status, team.members, team.isPublic, team.creationTime, team.lastModifiedTime];
    const dbResults = await db.query(dbQuery, dbValubes)

    return dbResults;
}

/**
 * Function to Save Event data to the Postgres DB
 * @param {*} event_id 
 * @param {*} event 
 * @param {*} members 
 * @returns 
 */
// create table events(event_id varchar(1000) primary key, event_name varchar(1000), event_origin varchar(1000),event_owner varchar(1000), attendees varchar(100) [], attending varchar(100) [], not_attending varchar(100)[], event_date date, event_start_time time, event_end_time time )
const createEvent = async (event_id, event, members) => {
    try {
        const dbQuery = "INSERT INTO events (event_id, event_name, event_origin, event_owner, attendees, attending, not_attending , event_date, event_start_time, event_end_time, maybe_attending, vaccinated, not_vaccinated, vaccination_status_not_disclosed, did_attend, did_not_attend ) values ($1, $2, $3, $4,$5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) returning *"
        const dbValubes = [event_id, event.event_name, event.event_origin, event.event_owner, members, [], [], event.event_date, event.event_start_time, event.event_end_time, [], [], [], [], [], []];
        const dbResults = await db.query(dbQuery, dbValubes);
        return dbResults;
    } catch (error) {
        console.error(error)
    }

}

/**
 * 
 * @param {*} event_id 
 * @returns 
 */
const getEvent = async (event_id) => {
    try {
        const dbQuery = "SELECT * from events where event_id = $1"
        const dbValubes = [event_id]
        const dbResults = await db.query(dbQuery, dbValubes);
        return dbResults;
    } catch (error) {

    }

}

/**
 * 
 * @param {*} event 
 * @returns 
 */
const updateEvent = async (event) => {

    console.log('Update event', event);
    try {
        const dbQuery = "UPDATE events SET event_name = $1, event_date = $2, event_start_time = $3, event_end_time = $4 where event_id = $5 returning *"
        const dbValubes = [event.event_name, event.event_date, event.event_start_time, event.event_end_time, event.event_id]
        const dbResults = await db.query(dbQuery, dbValubes);
        return dbResults;
    } catch (error) {

    }

}

// create table cards(card_id varchar(1000) primary key, team_id varchar(1000), event_id varchar(1000), receiver_user_id varchar(1000), conversation_id varchar(1000), card_action varchar(100))

/**
 * 
 * @param {*} card_id 
 * @param {*} receiver_id 
 * @param {*} conversation_id 
 * @param {*} event 
 * @returns 
 */
const createCard = async (card_id, receiver_id, conversation_id, event) => {
    try {
        const dbQuery = "INSERT INTO cards (card_id, team_id, event_id, receiver_user_id, conversation_id, card_action  ) values ($1, $2, $3, $4,$5, $6) returning *"
        const dbValubes = [card_id, event.event_origin, event.event_id, receiver_id, conversation_id, event.action];
        const dbResults = await db.query(dbQuery, dbValubes);
        return dbResults;
    } catch (error) {

    }

}

/**
 * 
 * @param {*} event 
 * @param {*} user_id 
 * @returns 
 */
const updateRSVP = async (event, user_id) => {
    try {
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
    } catch (error) {

    }


    // const dbQuery = "UPDATE events set attending = array_append(attending, $1 ) where event_id = $2 returning *"

}

/**
 * 
 * @param {*} teamID 
 * @returns 
 */
const getTeamMemebers = async (teamID) => {
    try {
        const dbQuery = "select memebers from teams where team_id = $1"
        const dbValubes = [teamID];
        const dbResults = await db.query(dbQuery, dbValubes)


        console.log('dbResults', dbResults);
        return dbResults
    } catch (error) {

    }


}

/**
 * 
 * @param {*} tokenData 
 */
const saveToken = async (tokenData) => {
    try {
        console.log("TOKEN data", tokenData);
        const dbQuery = "INSERT INTO tokens (token_type, access_token, expires_in, refresh_token, refresh_token_expires_in, accountId, subscriptionId) values ($1, $2, $3, $4, $5, $6, $7) returning *"
        const dbValues = [tokenData.token_type, tokenData.access_token, tokenData.expires_in, tokenData.refresh_token, tokenData.refresh_token_expires_in, tokenData.accountId, tokenData.owner_id]
        const dbResults = await db.query(dbQuery, dbValues);
        console.log('dbResults', dbResults);
    } catch (error) {
        console.log('error saving token');
        console.log(error);
    }


}


/**
 * 
 * @returns 
 */
const getToken = async () => {
    try {
        const dbQuery = "SELECT * FROM tokens"
        const dbResults = await db.query(dbQuery);
        // console.log('dbResults', dbResults);
        return dbResults
    } catch (error) {

    }

}


const getEvents = async (event_owner) => {
    try {
        const dbQuery = "select * from events where event_owner = $1"
        const dbValubes = [event_owner];
        const dbResults = await db.query(dbQuery, dbValubes)

        // console.log('dbResults', dbResults.rows);
        return dbResults
    } catch (error) {
        console.error('Unable to get Events list');
        console.error(error);
    }
}

const findTokenFromSubscriptionId = async (subscriptionId) => {
    try {
        const dbQuery = "SELECT * FROM tokens where subscriptionId = $1"
        const dbValubes = [subscriptionId];
        const dbResults = await db.query(dbQuery, dbValubes);
        // console.log('dbResults', dbResults);
        return dbResults
    } catch (error) {

    }
}

const findTokenFromAccountId = async (accountId) => {
    try {
        const dbQuery = "SELECT * FROM tokens where accountId = $1"
        const dbValubes = [accountId];
        const dbResults = await db.query(dbQuery, dbValubes);
        // console.log('dbResults', dbResults);
        return dbResults
    } catch (error) {

    }
}

const getRSVPDetails = async (eventId) => {
    try {
        const dbQuery = "select attendees, attending, not_attending, maybe_attending from events where event_id = $1"
        const dbValubes = [eventId];
        const dbResults = await db.query(dbQuery, dbValubes)

        return dbResults

    } catch (error) {
        console.error('Unable to get event Id');
        console.error(error);
    }
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
    getToken: getToken,
    getEvents: getEvents,
    getRSVPDetails: getRSVPDetails,
    findTokenFromSubscriptionId: findTokenFromSubscriptionId,
    findTokenFromAccountId: findTokenFromAccountId
}


