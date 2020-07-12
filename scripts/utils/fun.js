const fun1 = document.getElementById("fun1");
const currencyRatesDiv = document.getElementById("currencyRatesDiv");
const stopButton = document.createElement("button");

fun1.addEventListener("click", moveTable);

function moveTable() {
  fun1.style.display = "none";
  currencyRatesDiv.classList.add("tableFun");

  stopButton.style.display = "block";
  stopButton.textContent = "Stop the fun :(";
  stopButton.addEventListener("click", stopTable);
  table.append(stopButton);
}

function stopTable() {
  currencyRatesDiv.classList.remove("tableFun");
  fun1.style.display = "block";

  stopButton.style.display = "none";
}
