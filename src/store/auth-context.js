import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;
const AuthContext = React.createContext({
    // intializing context with some initial data which we set here so that we can define general shape of the context and get better autocompletion later.
    token: '',
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { }
});

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
    const remainingDuration = adjExpirationTime - currentTime;
    return remainingDuration;
};

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime');
    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if (remainingTime <= 60000) {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
    }
    return {
        token: storedToken,
        duration: remainingTime,
    }
};

export const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredToken();
    // when the app starts, we will look into our local storage to find a token there and if we find token there, we will use that token for authenticating the user automatically. hence, we will initialize our state with that 'token' instead of providing 'null' as a starting value.
    let initialToken;
    if (tokenData) {
        initialToken = tokenData.token;
    }


    // managing state for auth data
    // const [token, setToken] = useState(null);
    const [token, setToken] = useState(initialToken);

    // converts truthy/falsy values to true/false boolean. If token is a string that is empty, it will return false and if token is a string that is not empty, it will return true. 
    const userIsLoggedIn = !!token;

    // funtions for changing token state.
    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');

        // to clear all the data
        // localStorage.clear();
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);

    const loginHandler = (token, expirationTime) => {
        // storing token in the state.
        setToken(token);
        // storing token in the browser storage if user logs in. 
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);
        const remainingTime = calculateRemainingTime(expirationTime);

        logoutTimer = setTimeout(logoutHandler, remainingTime);
    };

    useEffect(() => {
        if (tokenData) {
            console.log(tokenData.duration);
            logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        }
    }, [tokenData, logoutHandler]);

    const contextValue = {
        token: token, // token state that we are managing
        isLoggedIn: userIsLoggedIn, // userIsLoggedIn value
        login: loginHandler,
        logout: logoutHandler,
    };

    return (<AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>);
};

export default AuthContext;