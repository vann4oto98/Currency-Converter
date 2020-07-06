import { getRatesSourceByDate } from "../services/currency-service.js"

let currentRatesSource = {}

const ctx = document.getElementById('myChart').getContext('2d');

const myLineChart = new Chart(ctx, {
  type: 'line',
  data: data,
  options: options
});

const from_currencyEl = document.getElementById("from_currency");
const datesSelect = document.getElementById("dates");
const from_ammountEl = document.getElementById("from_ammount");
const to_currencyEl = document.getElementById("to_currency");
const to_ammountEl = document.getElementById("to_ammount");
const rateEl = document.getElementById("rate");
const exchange = document.getElementById("exchange");

from_currencyEl.addEventListener("change", calculate);
from_ammountEl.addEventListener("input", calculate);
to_currencyEl.addEventListener("change", calculate);
to_ammountEl.addEventListener("input", calculate);

exchange.addEventListener("click", () => {
  const temp = from_currencyEl.value;
  from_currencyEl.value = to_currencyEl.value;
  to_currencyEl.value = temp;
  calculate();
});

datesSelect.addEventListener("change", function datesChangeHandler( {target: date} ) {

  getRatesSourceByDate(date.value).then(source => {
    currentRatesSource = source;
    console.log(currentRatesSource);
  });


  calculate();
})

export function domInit(mainRatesSource) {

  currentRatesSource = {date: mainRatesSource.chosenDate, rates: mainRatesSource.rates}
  const rateNames = makeRatesOptionElements(mainRatesSource);
  const rateNamesCopy = rateNames.cloneNode(true);
  from_currencyEl.appendChild(rateNames);
  to_currencyEl.appendChild(rateNamesCopy);
  datesSelect.appendChild(makeDatesOptionElements(mainRatesSource));
  calculate();
}

function calculate() {
  let dataRateFrom = currentRatesSource.rates[from_currencyEl.options[from_currencyEl.selectedIndex].value];
  let dataRateTo = currentRatesSource.rates[to_currencyEl.options[to_currencyEl.selectedIndex].value];
  let from_currencyName = from_currencyEl.options[from_currencyEl.selectedIndex].value;
  let to_currencyName = to_currencyEl.options[to_currencyEl.selectedIndex].value;


  rateEl.textContent = `1 ${from_currencyName} = ${parseFloat(((1 / dataRateFrom) * dataRateTo).toFixed(4))} ${to_currencyName}`;
  to_ammountEl.value = parseFloat(((from_ammountEl.value / dataRateFrom) * dataRateTo).toFixed(4));
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
