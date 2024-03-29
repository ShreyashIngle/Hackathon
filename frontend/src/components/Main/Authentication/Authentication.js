import React, { useState, useEffect } from 'react';
import './Authentication.scss';
import Signup from './Signup/Signup';
import Signin from './Signin/Signin';
import Button from '../../Button/Button';

const Authentication = ({ location }) => {
  const [authAction, setAuthAction] = useState(false);
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    if (jwt) {
      setAuthAction(true);
    }
    if (location.state) {
      setAuthAction(location.state.signIn);
    }
  }, [jwt, location]);

  const handleClick = () => {
    setAuthAction(!authAction);
  };

  return (
    <div className="authentication-wrapper">
      <div className="panel-l">
        {authAction ? (
          <h1>Need to create an account?</h1>
        ) : (
          <h1>Already have an account?</h1>
        )}
        <Button
          action={authAction ? 'Sign up' : 'Sign in'}
          color="dark"
          onClick={handleClick}
        />
      </div>
      <div className="panel-r">{authAction ? <Signin /> : <Signup />}</div>
    </div>
  );
};

export default Authentication;
