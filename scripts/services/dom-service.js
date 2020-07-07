import {
  getRatesSourceByDate,
  getTheLastTenRates,
} from "../services/currency-service.js";

let currentRatesSource = {};
let lastDatesRates = [];

let ctx = document.getElementById("myChart").getContext("2d");

let chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    title: {
      display: true,
      text: "Currency Rate For The Last 5 Days",
      fontSize: 14,
      fontColor: "rgba(255, 255, 255, 0.8)",
    },
    scales: {
      yAxes: [
        {
          ticks: {
            precision: 5,
            stepSize: 0.0025,
            fontColor: "rgba(255, 255, 255, 0.8)",
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            fontColor: "rgba(255, 255, 255, 0.8)",
          },
        },
      ],
    },
  },
});

const from_currencyEl = document.getElementById("from_currency");
const datesSelect = document.getElementById("dates");
const from_ammountEl = document.getElementById("from_ammount");
const to_currencyEl = document.getElementById("to_currency");
const to_ammountEl = document.getElementById("to_ammount");
const rateEl = document.getElementById("rate");
const exchange = document.getElementById("exchange");

from_currencyEl.addEventListener("change", () => {
  calculate();
  makeChart();
});
from_ammountEl.addEventListener("input", calculate);
to_currencyEl.addEventListener("change", () => {
  calculate();
  makeChart();
});
to_ammountEl.addEventListener("input", calculate);

exchange.addEventListener("click", () => {
  const temp = from_currencyEl.value;
  from_currencyEl.value = to_currencyEl.value;
  to_currencyEl.value = temp;
  calculate();
  makeChart();
});

datesSelect.addEventListener("change", function datesChangeHandler({
  target: date,
}) {
  getRatesSourceByDate(date.value).then((source) => {
    currentRatesSource = source;
  });

  calculate();
});

export function domInit(mainRatesSource) {
  currentRatesSource = {
    date: mainRatesSource.chosenDate,
    rates: mainRatesSource.rates,
  };
  const rateNames = makeRatesOptionElements(mainRatesSource);
  const rateNamesCopy = rateNames.cloneNode(true);
  from_currencyEl.appendChild(rateNames);
  to_currencyEl.appendChild(rateNamesCopy);
  datesSelect.appendChild(makeDatesOptionElements(mainRatesSource));
  getTheLastTenRates().then((x) => {
    lastDatesRates = x;
    makeChart();
  });
  calculate();
  fillTable();
}

function calculate() {
  let dataRateFrom =
    currentRatesSource.rates[
      from_currencyEl.options[from_currencyEl.selectedIndex].value
    ];
  let dataRateTo =
    currentRatesSource.rates[
      to_currencyEl.options[to_currencyEl.selectedIndex].value
    ];
  let from_currencyName =
    from_currencyEl.options[from_currencyEl.selectedIndex].value;
  let to_currencyName =
    to_currencyEl.options[to_currencyEl.selectedIndex].value;

  rateEl.textContent = `1 ${from_currencyName} = ${parseFloat(
    ((1 / dataRateFrom) * dataRateTo).toFixed(4)
  )} ${to_currencyName}`;
  to_ammountEl.value = parseFloat(
    ((from_ammountEl.value / dataRateFrom) * dataRateTo).toFixed(4)
  );
}

function makeRatesOptionElements(mainRatesSource) {
  const fragment = new DocumentFragment();

  let ratesArray = Object.keys(mainRatesSource.rates);

  ratesArray.sort((a, b) => a.localeCompare(b));

  ratesArray.forEach((x) => {
    const option = document.createElement("option");
    option.value = x;
    option.innerHTML = x;
    fragment.appendChild(option);
  });

  return fragment;
}

function makeDatesOptionElements(mainRatesSource) {
  const fragment = new DocumentFragment();

  let datesArray = JSON.parse(JSON.stringify(mainRatesSource.dates));

  datesArray.sort((a, b) => b.localeCompare(a));

  datesArray.forEach((x) => {
    const option = document.createElement("option");
    option.value = x;
    option.innerHTML = x;
    fragment.appendChild(option);
  });

  return fragment;
}

function makeChart() {
  const currencyRatesArray = [];
  const currencyLabelsArray = [];

  console.log(lastDatesRates);

  lastDatesRates.forEach((x) => {
    currencyLabelsArray.push(x.date);
    let dataRateFrom =
      x.rates[from_currencyEl.options[from_currencyEl.selectedIndex].value];
    let dataRateTo =
      x.rates[to_currencyEl.options[to_currencyEl.selectedIndex].value];
    currencyRatesArray.push(
      Number(parseFloat(((1 / dataRateFrom) * dataRateTo).toFixed(4)))
    );
  });

  removeData(chart);

  const dataset = {
    data: currencyRatesArray,
    showLine: true,
    fill: true,
    label: `${from_currencyEl.options[from_currencyEl.selectedIndex].value} - ${
      to_currencyEl.options[to_currencyEl.selectedIndex].value
    }`,

    fillColor: "rgba(159,170,174,0.8)",
    
    borderColor: "rgba(255, 255, 255, 0.8)",
    pointRadius: 5,
    backgroundColor: [
      "purple",
      "purple",
      "purple",
      "purple",
      "purple",
      "purple",
      "purple",
      "purple",
      "purple",
      "purple",
    ],
  };

  chart.data.datasets[0] = dataset;
  currencyLabelsArray.forEach((x) => {
    chart.data.labels.push(x);
  });

  chart.update();
}


function removeData(chart) {
  chart.data.labels = [];
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}

//Table logic

const table = document.getElementById("table");

function fillTable() {
  let td = table.querySelectorAll("td");

  let count = 0;

  let objectArray = [];
  for (const [key, value] of Object.entries(currentRatesSource.rates)) {
    objectArray.push({ key: key, value: value });
  }

  let arrayCounter = 0;
  setInterval(function () {
    if (count < td.length) {
      td[count++].textContent = objectArray[arrayCounter++].key;
      td[count++].textContent = objectArray[arrayCounter++].value;

      td[count++].textContent = objectArray[arrayCounter++].key;
      td[count++].textContent = objectArray[arrayCounter++].value;

      td[count++].textContent = objectArray[arrayCounter++].key;
      td[count++].textContent = objectArray[arrayCounter++].value;

      td[count++].textContent = objectArray[arrayCounter++].key;
      td[count++].textContent = objectArray[arrayCounter++].value;

      td[count++].textContent = objectArray[arrayCounter++].key;
      td[count++].textContent = objectArray[arrayCounter++].value;

      td[count++].textContent = objectArray[arrayCounter++].key;
      td[count++].textContent = objectArray[arrayCounter++].value;

      td[count++].textContent = objectArray[arrayCounter++].key;
      td[count++].textContent = objectArray[arrayCounter++].value;

      td[count++].textContent = objectArray[arrayCounter++].key;
      td[count++].textContent = objectArray[arrayCounter++].value;
    } else {
      count = 0;
    }

    if (arrayCounter == 32) {
      arrayCounter = 0;
    }
  }, 2000);
}
