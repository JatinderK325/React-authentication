import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: we can add validation here.
    // console.log(enteredEmail, enteredPassword)

    setIsLoading(true);
    let url;
    if (isLogin) { // If user is logged in 
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAUpvqcwLjG2JhxIALjxfIWEM3LXAztE1Q';
    }
    else { // If user is in sign up
      // sending sign up request:
      // we could use 'async/await' way. Here we are using promises with 'then', 'catch'.
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAUpvqcwLjG2JhxIALjxfIWEM3LXAztE1Q';
    }
    fetch(url,
      {
        method: 'POST',
        body: JSON.stringify({
          // this is a body payload required by 'firebase auth rest api'.
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true // will return a new token
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      // as we know fetch returns a 'promise' hence we can add 'catch' here to handle errors or 'then' for regular responses
    ).then(response => {
      setIsLoading(false);
      if (response.ok) {
        // if response is ok
        return response.json();
      } else {
        // if it fails, we will throw an error. so if it does fail, it means the response data we get back will hold some extra information. so we will look into response data by calling response.json() and it also returns promise so we can call 'then' here to get access to the actual response data and can show for example error modal. 
        return response.json().then(data => {
          // show an error message
          // console.log(data);
          let errorMessage = 'Authentication failed!';
          // if(data && data.error && data.error.message){
          //   errorMessage = data.error.message;
          // }
          throw new Error(errorMessage);
        });

      }
      // To get response data in success case and catch for handling errorr.
    }).then((data) => {
      // if no error
      // console.log(data);
      const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
      authCtx.login(data.idToken, expirationTime.toISOString());
      // hence we do have a token and we do logged the user in.
      // redirecting the user to the starting page after the successful response.
      history.replace('/');
    }).catch(err => {
      // if error
      alert(err.message);
    });

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
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending request...</p>}
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
