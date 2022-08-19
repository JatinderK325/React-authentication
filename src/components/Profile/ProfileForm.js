import { useContext, useRef } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const newPasswordInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredNewPassword = newPasswordInputRef.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAUpvqcwLjG2JhxIALjxfIWEM3LXAztE1Q', {
      method: 'POST',
      body: JSON.stringify({
        // this is a body payload required by 'firebase auth rest api'.
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: false // here we dont wan't to return new token
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => {
      // assumption: always succeeds! here we have taken just a success response means submitted password is correct hence changing password will work. we are not handling error case for this sent request.
      //// redirecting the user to the starting page after the successful response.
      history.replace('/');

    });

  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input
          type='password'
          id='new-password'
          minLength={7}
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
