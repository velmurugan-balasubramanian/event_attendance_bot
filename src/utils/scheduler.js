const momentTZ = require('moment-timezone');
const fetch = require('node-fetch');

const getTimeZones = async () => {

    try {
        let timeZonesArray = []
        const timeZonesList = momentTZ.tz.names();

        timeZonesList.forEach((timeZone, index) => {
            let timeZoneItem = {
                title: timeZone,
                value: timeZone
            }
            timeZonesArray.push(timeZoneItem)

        })
        return timeZonesArray
    } catch (error) {
        console.error('Unable to get timeZones');
        console.error("error", error);
    }

}

/**
 * Function to create a schedule to send invitation cards to the participants
 * @param {*} event_id event Id of the event,  
 * @param {*} timezone  
 * @param {*} event_type 
 * @param {*} schedule_type 
 * @param {*} bot_id 
 * @returns 
 */
const createSendInvitationSchedule = async (event_id, timezone, event_type, schedule_type, bot_id) => {
    let cronURL = process.env.CRON_URL
    let cronAPIKey = process.env.CRON_API_KEY
    let incomingCRONURL = process.env.INCOMING_SCHEDULAR_URL
    let URL = encodeURIComponent(`${incomingCRONURL}?event_id=${event_id}&event_type=${event_type}&schedule_type=${schedule_type}&bot_id=${bot_id}`)

    const dt = new Date()
    let minute = dt.getMinutes() + 3;
    let hour = dt.getHours();
    let date = dt.getDate()
    let month = dt.getMonth() + 1
    let year = dt.getFullYear();

    let cronString = `${minute} ${hour} ${date} ${month} * ${year}`

    try {
        let cronRequestUrl = `${cronURL}add?token=${cronAPIKey}&url=${URL}&cron_expression=${cronString}&timezone_from=2&timezone=${timezone}`
        const response = await fetch(cronRequestUrl, {});
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Unable to Schedule a Cron Job');
        console.error(error);
    }
}

const createReminder = async (event_id, event_date, event_start_time, remindBefore, timezone, event_type, schedule_type, bot_id) => {

    try {
        // Create a cron Job to to fire messaging
        await createCRONJob(event_id, event_date, event_start_time, remindBefore, timezone, event_type, schedule_type, bot_id)
    } catch (error) {
        console.error('Unable to Schedule a Cron Job');
        console.error(error);
    }
}

const createCRONJob = async (event_id, event_date, event_start_time, remindBefore, timezone, event_type, schedule_type, bot_id) => {

    let cronURL = process.env.CRON_URL
    let cronAPIKey = process.env.CRON_API_KEY
    let incomingCRONURL = process.env.INCOMING_SCHEDULAR_URL
    let URL = encodeURIComponent(`${incomingCRONURL}?event_id=${event_id}&event_type=${event_type}&schedule_type=${schedule_type}&bot_id=${bot_id}`)

    try {

        let cronString = await constructCRONStringForReminder(event_date, event_start_time, remindBefore)

        let cronRequestUrl = `${cronURL}add?token=${cronAPIKey}&url=${URL}&cron_expression=${cronString}&timezone_from=2&timezone=${timezone}`

        const response = await fetch(cronRequestUrl, {});
        const data = await response.json();
        return data

    } catch (error) {
        console.error('Unable to Create a cron JOB');
        console.error(error);
    }


}

const constructCRONStringForReminder = async (event_date, event_start_time, remindBefore) => {

    const dt = new Date(`${event_date} ${event_start_time}`)
    let minute = dt.getMinutes();
    let hour = dt.getHours();
    let date = dt.getDate()
    let month = dt.getMonth() + 1
    let year = dt.getFullYear();
    let eventStartTImeInMinutes = (hour * 60) + minute
    if (eventStartTImeInMinutes < remindBefore) {
        date = date - 1;
        let refMin = 1440 - (remindBefore - eventStartTImeInMinutes)
        minute = refMin % 60
        hour = Math.floor(refMin / 60)
    } else {
        let refMin = eventStartTImeInMinutes - remindBefore
        minute = refMin % 60
        hour = Math.floor(refMin / 60);
    }

    // Return the Cron String
    return `${minute} ${hour} ${date} ${month} * ${year}`

}



module.exports = {
    getTimeZones: getTimeZones,
    createReminder: createReminder,
    createSendInvitationSchedule: createSendInvitationSchedule
}


