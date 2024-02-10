import React, { useContext } from 'react';
import './TeacherListItem.scss';
import { Link } from '@reach/router';
import { SearchContext } from '../../../globalState/index';

const TeacherListItem = ({ teacher }) => {
  const { setSearchValue } = useContext(SearchContext);

  const handleNavigation = () => {
    setTimeout(() => {
      setSearchValue('');
    }, 1000);
  };

  return (
    <Link
      to={`teachers/${teacher._id}`}
      state={teacher}
      onClick={() => handleNavigation()}
    >
      <div className="teacher-list-item-wrapper">
        <div className="teacher-list-item-container">
          <div className="profile">
            <img
              className="avatar"
              src={teacher.profileImage ? teacher.profileImage : null}
              alt=""
            />
            <div>
              {teacher.firstName} {teacher.lastName}
            </div>
          </div>
          <span className="speciality">{teacher.teacherInfo.specialtyField}</span>
        </div>
      </div>
    </Link>
  );
};

export default TeacherListItem;
