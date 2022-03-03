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
        console.log('Unable to get timeZones');
        console.error("error", error);
    }

}

const createReminder = async (cardData) => {
    let cronURL = process.env.CRON_URL
    let cronAPIKey = process.env.CRON_API_KEY
    let incomingCRONURL = process.env.INCOMING_SCHEDULAR_URL

    console.log('Timezone', cardData);
    try {
        let cronString = await constructCRON(cardData)
        let cronRequestUrl = `${cronURL}add?token=${cronAPIKey}&url=${incomingCRONURL}&cron_expression=${cronString}&timezone_from=2&timezone=${cardData.timezone}`
        console.log('Cron Request URL', cronRequestUrl);

        const response = await fetch(cronRequestUrl, {});
        const data = await response.json();
        console.log('Data',data);
        return data

    } catch (error) {
        console.error('Unable to Schedule a Cron Job');
        console.error(error);
    }
}

const constructCRON = async (cardData) => {

    const dt = new Date(`${cardData.event_date} ${cardData.event_start_time}`)
    let remindBefore = 0;
    let minute = dt.getMinutes();
    let hour = dt.getHours();
    let date = dt.getDate()
    let month = dt.getMonth() + 1
    let year = dt.getFullYear();
    if (minute < remindBefore) {
        minute = (60 + minute) - remindBefore
        hour = hour === 00 ? 23 : hour - 1
    } else {
        minute = minute - remindBefore
    }

    let cronString = `${minute} ${hour} ${date} ${month} * ${year}`

    return cronString

}

module.exports = {
    getTimeZones: getTimeZones,
    createReminder: createReminder
}


