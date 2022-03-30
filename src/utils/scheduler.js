const { addScheduleToDB } = require('../utils/db')
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

const createReminder = async (event_id, event_date, remindBefore, timezone, event_type, schedule_type, bot_id) => {

    try {
        // Create a cron Job to to fire messaging
        let response = await createCRONJob(event_id, event_date, remindBefore, timezone, event_type, schedule_type, bot_id)
        console.log(response);
        console.info(`Reminder created`, { event_id: event_id, schedule_type: schedule_type, cron_job_id: response.cron_job_id })
        await addScheduleToDB(response.cron_job_id, event_id)
        return true
    } catch (error) {
        console.error('Unable to Schedule a Cron Job');
        console.error(error);
    }
}

const createCRONJob = async (event_id, event_date, remindBefore, timezone, event_type, schedule_type, bot_id) => {

    let cronURL = process.env.CRON_URL
    let cronAPIKey = process.env.CRON_API_KEY
    let incomingCRONURL = process.env.INCOMING_SCHEDULAR_URL
    let URL = encodeURIComponent(`${incomingCRONURL}?event_id=${event_id}&event_type=${event_type}&schedule_type=${schedule_type}&bot_id=${bot_id}`)

    try {

        let cronString = await constructCRONStringForReminder(event_date, remindBefore)


        let cronRequestUrl = `${cronURL}add?token=${cronAPIKey}&url=${URL}&cron_expression=${cronString}&timezone_from=2&timezone=${timezone}`

        console.info('URL', URL)
        console.info('cronRequestUrl', cronRequestUrl)

        const response = await fetch(cronRequestUrl, {});
        const data = await response.json();
        return data

    } catch (error) {
        console.error('Unable to Create a cron JOB');
        console.error(error);
    }


}

const constructCRONStringForReminder = async (event_date, remindBefore) => {
    const dt = event_date
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

const createSchedules = async (event_id, cardbody) => {
    await Promise.all([
        createReminder(event_id, new Date(`${cardbody.data.event_date} ${cardbody.data.event_start_time}`), cardbody.data.first_reminder, cardbody.data.timezone, cardbody.data.event_type, 'reminder', cardbody.data.bot_id),
        createReminder(event_id, new Date(`${cardbody.data.event_date} ${cardbody.data.event_start_time}`), cardbody.data.first_reminder, cardbody.data.timezone, cardbody.data.event_type, 'reminder', cardbody.data.bot_id),
        createReminder(event_id, new Date(`${cardbody.data.event_date} ${cardbody.data.event_start_time}`), 300, cardbody.data.timezone, cardbody.data.event_type, 'fomo_reminder', cardbody.data.bot_id),
        createReminder(event_id, new Date(`${cardbody.data.event_date} ${cardbody.data.event_start_time}`), 0, cardbody.data.timezone, cardbody.data.event_type, 'checkin', cardbody.data.bot_id),
        createReminder(event_id, new Date(new Date().toLocaleString('en-US', { timeZone: cardbody.data.timezone })), -2, cardbody.data.timezone, cardbody.data.event_type, 'invitation', cardbody.data.bot_id)
    ]);
}

const updateSchdules = async (schedules, cardBody) => {

    // Delete the Exisiting schedules
    schedules.forEach(async (schedule) => {
        await deleteSchedule(schedule.cron_job_id)
    });

    // Create new Schedules
    await createSchedules(cardBody.data.event_id, cardBody)

}

const deleteSchedule = async (cron_job_id) => {

    try {
        let cronURL = process.env.CRON_URL
        let cronAPIKey = process.env.CRON_API_KEY
        let cronRequestUrl = `${cronURL}delete?token=${cronAPIKey}&id=${cron_job_id}`
        let response = await fetch(cronRequestUrl)
        console.info(`Deleted schedule ${cron_job_id}`)
    } catch (error) {
        console.error(error);
    }

}


module.exports = {
    createSchedules: createSchedules,
    getTimeZones: getTimeZones,
    createReminder: createReminder,
    updateSchdules: updateSchdules
}


