import { requester } from "../utils/kinvey-requester.js";


const username = 'admin';
const password = 'admin';

function loginUser() {
    const user = {
        username: username,
        password: password,
    };

    requester.post("user", "login", user, "Basic")
        .then(userData => {
            sessionStorage.setItem("userID", userData._id);
            sessionStorage.setItem("username", userData.username);
            sessionStorage.setItem("authtoken", userData._kmd.authtoken);
        }).catch(error => {
            console.error(error);
        });
}

loginUser();


