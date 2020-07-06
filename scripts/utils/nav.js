let converter = document.getElementById("converter");
let currencyRates = document.getElementById("currencyRatesDiv");
let about = document.getElementById("aboutDiv");

let currencyRatesNav = document.getElementById("currencyRatesNav");
let aboutNav = document.getElementById("aboutNav");
let converterNav = document.getElementById("converterNav");

currencyRatesNav.addEventListener("click", showCurrencyRates);
aboutNav.addEventListener("click", showAbout);
converterNav.addEventListener("click", showConverter);

function showCurrencyRates() {
  converter.style.display = "none";
  about.style.display = "none";
  currencyRates.style.display = "block";

  aboutNav.classList.remove("active");
  converterNav.classList.remove("active");
  currencyRatesNav.classList.add("active");
}

function showAbout() {
  converter.style.display = "none";
  about.style.display = "block";
  currencyRates.style.display = "none";

  aboutNav.classList.add("active");
  converterNav.classList.remove("active");
  currencyRatesNav.classList.remove("active");
}

function showConverter() {
  converter.style.display = "block";
  about.style.display = "none";
  currencyRates.style.display = "none";

  aboutNav.classList.remove("active");
  converterNav.classList.add("active");
  currencyRatesNav.classList.remove("active");
}
