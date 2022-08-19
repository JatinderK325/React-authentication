import React, { useState } from "react";

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

export const AuthContextProvider = (props) => {
    // when the app starts, we will look into our local storage to find a token there and if we find token there, we will use that token for authenticating the user automatically. hence, we will initialize our state with that 'token' instead of providing 'null' as a starting value.
    const initialToken = localStorage.getItem('token');

    // managing state for auth data
    // const [token, setToken] = useState(null);
    const [token, setToken] = useState(initialToken);

    // converts truthy/falsy values to true/false boolean. If token is a string that is empty, it will return false and if token is a string that is not empty, it will return true. 
    const userIsLoggedIn = !!token;

    // funtions for changing token state.
    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem('token');
        // to clear all the data
        // localStorage.clear();
    };

    const loginHandler = (token, expirationTime) => {
        // storing token in the state.
        setToken(token);
        // storing token in the browser storage if user logs in. 
        localStorage.setItem('token', token);
        const remainingTime = calculateRemainingTime(expirationTime);

        setTimeout(logoutHandler, remainingTime);
    };

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