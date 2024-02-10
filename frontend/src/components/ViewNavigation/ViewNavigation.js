import React from 'react';
import './ViewNavigation.scss';
import { Link } from '@reach/router';
import Button from '../Button/Button';

const ViewNavigation = ({ location }) => {
  const showNavigationControls = () => {
    const ParentListRegex = /parents\/\d*/;
    // e.g Parents/123223
    if (ParentListRegex.test(location.pathname)) {
      // if (location.pathname === '/parents/3') {
      return (
        <div className="view-navigation-wrapper">
          <Link to="/parents">
            <Button
              action="Back to parent list"
              color="navy"
              icon="arrowLeft"
            />
          </Link>
        </div>
      );
    }

    return null;
  };

  return <div>{showNavigationControls()}</div>;
};

export default ViewNavigation;
