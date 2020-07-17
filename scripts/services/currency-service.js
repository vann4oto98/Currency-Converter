import {
    requester
} from "../utils/kinvey-requester.js";
import {
    domInit
} from "./dom-service.js"

export function init() {

    const mainRatesSource = {};

    const currentDate = new Date().toJSON().slice(0, 10);
    let datesArray = [];

    requester.get("appdata", "dates", "Kinvey")
        .then(allDates => {

            datesArray = allDates.map(date => date.added_date);
            mainRatesSource.dates = JSON.parse(JSON.stringify(datesArray));
            mainRatesSource.dates.sort((a, b) => b.localeCompare(a));
            mainRatesSource.chosenDate = currentDate;
            if (!datesArray.includes(currentDate)) {
                fillPreviousDates(mainRatesSource.dates[0], currentDate)
                    .then(promiseAllValues => {

                        mainRatesSource.dates = getNewDatesArrayWithAddedDates(promiseAllValues, mainRatesSource.dates);

                        requester.post("appdata", "dates", {
                                added_date: currentDate
                            }, "Kinvey")
                            .then(response => {
                                fetch('https://api.exchangeratesapi.io/latest')
                                    .then(response => response.json())
                                    .then(data => {
                                        requester.post("appdata", "rates", {
                                                date: currentDate,
                                                rates: data.rates
                                            }, "Kinvey")
                                            .then(response => {
                                                data.rates['EUR'] = 1;
                                                mainRatesSource.dates.unshift(currentDate);
                                                mainRatesSource.rates = data.rates;

                                                domInit(mainRatesSource);
                                            })
                                            .catch(console.error);
                                    });

                            }).catch(console.error);

                    });
            } else {
                getRatesByDate(currentDate)
                    .then(data => {
                        data[0].rates['EUR'] = 1;
                        mainRatesSource.rates = data[0].rates;
                        domInit(mainRatesSource);
                    });
            }

        }).catch(console.error);
}


function getRatesByDate(date) {

    return requester.get("appdata", "rates", "Kinvey", `?query={"date":"${date}"}`);

}

function fillPreviousDates(latestDate, currentDate) {

    const preCurrentDate = getDateWithDaysDifference(currentDate, -1);
    const postLatestDate = getDateWithDaysDifference(latestDate, 1)


    return fetch(`https://api.exchangeratesapi.io/history?start_at=${postLatestDate}&end_at=${preCurrentDate}`)
        .then(x => x.json())
        .then(x => {
            const ratesToFill = [];

            Object.keys(x.rates)
                .forEach(key => ratesToFill.push({
                    date: key,
                    rates: x.rates[key]
                }))


            ratesToFill.sort((a, b) => a.date.localeCompare(b.date));

            return ratesToFill;
        })
        .then(x => {
            const requestsArray = [];

            x.forEach(rateElement => {
                requestsArray.push(makeDateCreateRequest(rateElement.date));
                requestsArray.push(makeRateCreateRequest(rateElement.date, rateElement.rates));
            })

            return requestsArray;
        }).then(x => Promise.all(x));
}

function getNewDatesArrayWithAddedDates(promiseAllValues, datesArray) {

    const newArray = datesArray.slice(0);

    for (let i = 0; i < promiseAllValues.length; i+=2) {
        
        newArray.unshift(promiseAllValues[i].added_date);
    }

    return newArray;

}

function getDateWithDaysDifference(currentDate, difference) {
    let lastDate = new Date(Date.parse(currentDate));
    lastDate.setDate(lastDate.getDate() + difference);
    lastDate = lastDate.toJSON().slice(0, 10);
    return lastDate;
}

function makeDateCreateRequest(date) {
    return requester.post("appdata", "dates", {
        added_date: date
    }, "Kinvey");
}

function makeRateCreateRequest(date, rates) {
    return requester.post("appdata", "rates", {
        date: date,
        rates: rates
    }, "Kinvey");
}

export function getRatesSourceByDate(date) {

    const ratesSource = {
        date
    };

    return getRatesByDate(date)
        .then(x => {
            ratesSource.rates = x[0].rates;
            ratesSource.rates['EUR'] = 1;
            return ratesSource;
        });
}

export function getTheLastTenRates() {

    return requester.get("appdata", "rates", "Kinvey", `?query={}&sort={"date": -1}&limit=10`)
        .then(allDates => {

            const finalRates = allDates.map(x => {
                x.rates['EUR'] = 1;
                return {
                    date: x.date,
                    rates: x.rates
                }
            });

            finalRates.sort((a, b) => {
                return a.date.localeCompare(b.date);
            });

            return finalRates;
        })

}