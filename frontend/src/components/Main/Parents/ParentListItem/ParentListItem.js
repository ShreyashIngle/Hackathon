import React from 'react';
import './ParentListItem.scss';
import { Link } from '@reach/router';
const ParentListItem = ({ name, id, state }) => {
  return (
    <Link to={`${id}`} state={state}>
      <div className="parent-list-item-wrapper">
        <div className="parent-list-item-container">
          <div className="profile">
            <div className="avatar" />
            <div>{name}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ParentListItem;
