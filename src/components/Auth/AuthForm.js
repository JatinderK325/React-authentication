import { useState, useRef } from 'react';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: we can add validation here.
    // console.log(enteredEmail, enteredPassword)

    if (isLogin) { // If user is logged in 
    }
    else { // If user is in sign up
      // sending sign up request:
      fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAUpvqcwLjG2JhxIALjxfIWEM3LXAztE1Q',
        {
          method: 'POST',
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
        // as we know fetch returns a 'promise' hence we can add 'catch' here to handle errors or 'then' for regular responses
      ).then(response => {
        if (response.ok) {

        } else {
          // if it fails, we will throw an error. so if it does fail, it means the response data we get back will hold some extra information. so we will look into response data by calling response.json() and it also returns promise so we can call 'then' here to get access to the actual response data and can show for example error modal. 
          return response.json().then(data => {
            console.log(data);
          });

        }
      });
    }

  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input
            type='email'
            id='email' required
            ref={emailInputRef}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password' required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
