import { requester } from "../utils/kinvey-requester.js";
//todo  (i have no access to database)
function fillTable() {
  requester.get("appdata", "currency", "Kinvey").then((currency) => {
    console.log(currency);
  });
}

//fillTable();
