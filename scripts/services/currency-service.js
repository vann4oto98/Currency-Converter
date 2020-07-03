import {
    requester
} from "../utils/kinvey-requester.js";
import {
    domInit
} from "./dom-service.js"

function init() {

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
                requester.post("appdata", "dates", {
                    added_date: currentDate
                }, "Kinvey")
                    .then(response => {

                    }).catch(console.error);

                fetch('https://api.exchangeratesapi.io/latest')
                    .then(response => response.json())
                    .then(data => {
                        requester.post("appdata", "rates", {
                            date: currentDate,
                            rates: data.rates
                        }, "Kinvey")
                            .then(response => {
                                mainRatesSource.rates = data.rates;
                                domInit(mainRatesSource);
                            })
                            .catch(console.error);
                    });

            } else {
                getRatesByDate(currentDate)
                    .then(data => {
                        mainRatesSource.rates = data[0].rates;
                        domInit(mainRatesSource);
                    });
            }

        }).catch(console.error);


}

init();

function getRatesByDate(date) {

    return requester.get("appdata", "rates", "Kinvey", `?query={"date":"${date}"}`);

}