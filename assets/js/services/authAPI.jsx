import axios from 'axios';
import jwtDecode from 'jwt-decode'

function logout() {
    window.localStorage.removeItem("AuthToken");
    delete axios.defaults.headers["Authorization"];
}

function authentificate(credentials) {
    return axios.post("http://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            //Stockage du token dans le localStorage
            window.localStorage.setItem("AuthToken", token);

            //Les requetes auront un header par default
            setAxiosToken(token);
        });

}

function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function setup() {
    const token = window.localStorage.getItem("AuthToken");

    if (token) {
        const { exp: expiration } = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}

function isAuthentificated() {
    const token = window.localStorage.getItem("AuthToken");

    if (token) {
        const { exp: expiration } = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            return true;
        } return false;
    } return false;
}

export default {
    authentificate,
    logout,
    setup,
    isAuthentificated
}