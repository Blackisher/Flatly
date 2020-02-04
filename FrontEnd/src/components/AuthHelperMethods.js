//inspiration from link https://medium.com/@romanchvalbo/how-i-set-up-react-and-node-with-json-web-token-for-authentication-259ec1a90352

import React, {Component} from 'react';
import "../css/App.css";
import decode from 'jwt-decode'

export const idUser = localStorage.getItem("id_user");

export const  logout = () => {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("security_token");
    localStorage.removeItem("id_user");
    return localStorage.getItem("security_token")
};

class AuthHelperMethods extends Component {
    constructor(props) {
        super(props);
    }

    login = (login, password) => {
        // Get a token from api server using the fetch api

        return this.fetch(`http://flatly-thursday.us-east-1.elasticbeanstalk.com/users`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login,
                password
            })
        }).then(res => {
            this.setToken(res.security_token); // Setting the token in localStorage
            this.setIdUser(res.id);
            return Promise.resolve(res);
        });
    };

    loggedIn = () => {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken(); // Getting token from localstorage
        return !!token && !this.isTokenExpired(token); // handwaiving here
    };

    isTokenExpired = token => {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                // Checking if token is expired.
                return true;
            } else return false;
        } catch (err) {
            console.log("expired check failed!");
            return false;
        }
    };

    setToken = idToken => {
        // Saves user token to localStorage
        localStorage.setItem("security_token", idToken);
    };

    setIdUser = id => {
        // Saves user id to localStorage
        localStorage.setItem("id_user", id);
    };

    getToken = () => {
        // Retrieves the user token from localStorage
        return localStorage.getItem("security_token");
    };

    getConfirm = () => {
        // Using jwt-decode npm package to decode the token
        let answer = decode(this.getToken());
        console.log("Recieved answer!");
        return answer;
    };

    fetch = (url, options) => {
        // performs api calls sending the required authentication headers
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json"
        };
        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers["Authorization"] = "Bearer " + this.getToken();
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json());
    };

    _checkStatus = response => {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) {
            // Success status lies between 200 to 300
            return response;
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    };
}

export default AuthHelperMethods;