import React from 'react';
import Card from '../../../Card/Card';
import { v4 as uuidv4 } from 'uuid';

const TeacherInfo = ({ user }) => {
  return (
    <Card>
      <div className="user-profile-container">
        <div className="user-header-wrapper">
          <h2>Information</h2>
        </div>
        <div className="user-details-wrapper teacher-info">
          <div className="grid-item">
            <div className="user-info">
              <span>licence</span>
              <span>{user.teacherInfo.licence}</span>
            </div>
          </div>
          <div className="grid-item">
            <div className="user-info">
              <span>accreditations</span>
              {user.teacherInfo.accreditations.map(el => (
                <span key={uuidv4()}>{el}</span>
              ))}
            </div>
          </div>
          <div className="grid-item">
            <div className="user-info">
              <span>specialty</span>
              <span>{user.teacherInfo.specialtyField}</span>
            </div>
          </div>
          <div className="grid-item">
            <div className="user-info">
              <span>subspecialty</span>
              <span>{user.teacherInfo.subSpecialtyField}</span>
            </div>
          </div>
          <div className="grid-item">
            <div className="user-info">
              <span>Education</span>
              {user.teacherInfo.education.map(el => (
                <span key={uuidv4()}>{el}</span>
              ))}
            </div>
          </div>
          <div className="grid-item">
            <div className="user-info">
              <span>Experience</span>
              <span>{user.teacherInfo.yearsExperience} Years</span>
            </div>
          </div>
          <div className="grid-item">
            <div className="user-info">
              <span>Languages</span>
              {user.teacherInfo.languagesSpoken.map(el => (
                <span key={uuidv4()}>{el}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TeacherInfo;
