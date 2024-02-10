import React, { useContext } from 'react';
import { Redirect } from '@reach/router';
import { AuthContext } from '../../globalState/index';

const PrivateTeacherRoute = rest => {
  const { user } = useContext(AuthContext);
  const { as: Comp, ...props } = rest;
  return user.isTeacher ? (
    <Comp {...props} />
  ) : (
    <Redirect to="/404" replace={true} noThrow={true} />
  );
};

export default PrivateTeacherRoute;
