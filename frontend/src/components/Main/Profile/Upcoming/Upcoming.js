import React, { useEffect, useState } from 'react';
import Card from '../../../Card/Card';
import moment from 'moment';
import _ from 'lodash';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { renderUnavailabilities } from '../../Appointments/Appointments';
import { handleEventStyle } from '../../Appointments/MainCalendar/MainCalendar';
import '../../Appointments/Appointments.scss';

const localizer = momentLocalizer(moment);

const Upcoming = ({ user }) => {
  const [unavailabilities, setUnavailabilities] = useState([]);

  useEffect(() => {
    if (
      user.isTeacher &&
      _.has(user.teacherInfo.workSchedule, 'openingTime') &&
      _.has(user.teacherInfo.workSchedule, 'closingTime') &&
      _.has(user.teacherInfo.workSchedule, 'lunchBreakStart') &&
      _.has(user.teacherInfo.workSchedule, 'lunchBreakEnd') &&
      user.teacherInfo.workSchedule.unavailableDateTimes.length >= 0
    ) {
      renderUnavailabilities(user.teacherInfo.workSchedule, setUnavailabilities);
    }
  }, [user]);

  return (
    <Card>
      <div className="user-profile-container">
        <div className="user-header-wrapper">
          <h2>Availability</h2>
        </div>
        <div className="user-details-wrapper">
          <div className="user-info">
            <span>Openning Time </span>
            <span>
              {moment(user.teacherInfo.workSchedule.openingTime).format(
                'hh:mm A'
              )}
            </span>
          </div>
          <div className="user-info">
            <span>Closing Time </span>
            <span>
              {moment(user.teacherInfo.workSchedule.closingTime).format(
                'hh:mm A'
              )}
            </span>
          </div>
        </div>
        <div className="appointments-profile-wrapper">
          <Calendar
            events={unavailabilities}
            startAccessor="start"
            endAccessor="end"
            defaultDate={moment().toDate()}
            localizer={localizer}
            eventPropGetter={event => handleEventStyle(event, user)}
            defaultView="day"
            views={['day', 'work_week']}
            min={
              !_.isEmpty(user) && user.teacherInfo.workSchedule.openingTime
                ? moment(user.teacherInfo.workSchedule.openingTime).toDate()
                : undefined
            }
            max={
              !_.isEmpty(user) && user.teacherInfo.workSchedule.closingTime
                ? moment(user.teacherInfo.workSchedule.closingTime).toDate()
                : undefined
            }
          />
        </div>
      </div>
    </Card>
  );
};

export default Upcoming;
