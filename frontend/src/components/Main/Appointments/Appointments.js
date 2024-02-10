import React, { useContext, useState, useEffect } from 'react';
import MainCalendar from './MainCalendar/MainCalendar';
import { RRule } from 'rrule';
import { v4 } from 'uuid';
import moment from 'moment';
import _ from 'lodash';
import omitDeep from 'omit-deep-lodash';
import {
  TeacherListContext,
  AuthContext,
  MessageContext,
} from '../../../globalState/index';
import { request } from '../../AxiosTest/config';
import { updateProfile } from '../../AxiosTest/userRoutes';
import { round, convertUTC } from './helpers';
import CalendarForm from './CalendarForm/CalendarForm';
import './Appointments.scss';

export const renderUnavailabilities = (teacher, cb) => {
  let selectedTeacherUnavailabilites;

  if (teacher.teacherInfo && teacher.teacherInfo.workSchedule) {
    selectedTeacherUnavailabilites = teacher.teacherInfo.workSchedule;
  } else {
    selectedTeacherUnavailabilites = teacher;
  }

  // Separate lunch break
  const lunchBreakStart = selectedTeacherUnavailabilites.lunchBreakStart;
  const lunchBreakEnd = selectedTeacherUnavailabilites.lunchBreakEnd;
  const lunchBreak = { lunchBreakStart, lunchBreakEnd };

  const lunchBreakDifference = moment(lunchBreakEnd).diff(
    moment(lunchBreakStart),
    'minutes'
  );

  const lunchBreakRRule = convertLunchBreakToRRule(lunchBreak);
  // console.log(lunchBreakRRule);

  const lunchBreakEvents = convertLunchBreakRruleToCalendarDates(
    lunchBreakRRule,
    lunchBreakDifference
  );
  // Unavailabilities Array -
  const teacherUnavailabilities =
    selectedTeacherUnavailabilites.unavailableDateTimes;

  const unavailabilitiesRRules = convertUnavailabilitiesToRRule(
    teacherUnavailabilities
  );

  // console.log(unavailabilitiesRRules);

  const unavailableEvents = convertTeacherUnavailabilityToCalendarDates(
    unavailabilitiesRRules
  );
  // console.log(unavailableEvents);

  const calendarEvents = lunchBreakEvents.concat(
    _.flattenDeep(unavailableEvents)
  );

  cb(calendarEvents);
};

export const convertLunchBreakToRRule = lunchBreak => {
  const lunchBreakRRule = new RRule({
    freq: RRule.DAILY,
    dtstart: convertUTC(lunchBreak.lunchBreakStart),
    until: convertUTC(moment(lunchBreak.lunchBreakEnd).add(1, 'year').toDate()),
    interval: 1,
  });

  return lunchBreakRRule;
};

export const convertUnavailabilitiesToRRule = unavailabilitiesArr => {
  return unavailabilitiesArr.map(el => {
    const difference = moment(el.endDateTime).diff(
      moment(el.startDateTime),
      'minutes'
    );

    // if modifier is not 3 or 2 e.g weekly or daily, it is therefore a one-off unavailability
    // for now these events are set with a modifier of 0
    const until =
      +el.modifier === 3 || +el.modifier === 2
        ? convertUTC(moment(el.endDateTime).add(1, 'year').toDate())
        : convertUTC(moment(el.endDateTime).toDate());

    return [
      new RRule({
        freq: parseInt(el.modifier), // must be an integer
        dtstart: convertUTC(el.startDateTime),
        until,
        interval: 1,
      }),
      difference,
    ];
  });
};

export const convertTeacherUnavailabilityToCalendarDates = unavailabilitiesRRuleArr => {
  return unavailabilitiesRRuleArr.map(el => {
    const ruleAll = el[0].all();
    return ruleAll.map(startTime => {
      const start = moment(startTime).toDate();
      const end = moment(start).add({ minutes: el[1] }).toDate();

      return {
        id: v4(),
        title: 'Unavailable',
        start: start,
        end: end,
        same: moment(start).isSame(moment(end)),
        status: 'unavailable',
      };
    });
  });
};

export const convertLunchBreakRruleToCalendarDates = (
  lunchBreakRRule,
  difference
) => {
  const ruleAll = lunchBreakRRule.all();

  return ruleAll.map(startTime => {
    const start = moment(startTime).toDate();
    const end = moment(start).add({ minutes: difference }).toDate();

    return {
      id: v4(),
      title: 'Lunch Break',
      start: start,
      end: end,
      same: moment(start).isSame(moment(end)),
      status: 'unavailable',
    };
  });
};

const Appointments = () => {
  const handleShowMonday = () => {
    const today = moment().isoWeekday();

    if (today === 6) {
      return moment().add({ day: 2 });
    }

    if (today === 7) {
      return moment().add({ day: 1 });
    }

    return moment();
  };

  const { user, setUser } = useContext(AuthContext);
  const { setFlashMessage } = useContext(MessageContext);
  const { teacherList } = useContext(TeacherListContext);
  const [unavailabilities, setUnavailabilities] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tabState, setTabState] = useState({
    activeTab: 'availability',
  });
  const [selectedTeacher, setSelectedTeacher] = useState({});
  const [clientFormState, setClientFormState] = useState({
    teacher: '',
    startTime: round(moment(), moment.duration(30, 'minutes'), 'ceil').toDate(),
    endTime: '',
    sessionDuration: '',
  });
  const [teacherAvailability, setTeacherAvailability] = useState({
    openingTime: handleShowMonday().set({ hour: 5, minutes: 0 }).toDate(),
    closingTime: handleShowMonday().set({ hour: 23, minutes: 0 }).toDate(),
    lunchBreakStart: handleShowMonday().set({ hour: 11, minutes: 0 }).toDate(),
    lunchBreakEnd: handleShowMonday().set({ hour: 13, minutes: 0 }).toDate(),
    unavailableDateTimes: [
      {
        startDateTime: handleShowMonday()
          .set({ hour: 17, minutes: 0 })
          .toDate(),
        endDateTime: handleShowMonday().set({ hour: 18, minutes: 0 }).toDate(),
        modifier: RRule.WEEKLY,
      },
    ],
  });

  // Actions

  useEffect(() => {
    if (!_.isEmpty(selectedTeacher) && !user.isTeacher) {
      // client view of appointments
      renderUnavailabilities(selectedTeacher, setUnavailabilities);
    }

    if (
      //existing teacher (Double check and test the last condition here)
      user.isTeacher &&
      _.has(user.teacherInfo.workSchedule, 'openingTime') &&
      _.has(user.teacherInfo.workSchedule, 'closingTime') &&
      _.has(user.teacherInfo.workSchedule, 'lunchBreakStart') &&
      _.has(user.teacherInfo.workSchedule, 'lunchBreakEnd') &&
      user.teacherInfo.workSchedule.unavailableDateTimes.length >= 0
    ) {
      renderUnavailabilities(user.TeacherInfo.workSchedule, setUnavailabilities);
    }

    if (
      // teacher first signs up
      user.isTeacher &&
      !_.has(user.teacherInfo.workSchedule, 'openingTime') &&
      !_.has(user.teacherInfo.workSchedule, 'closingTime') &&
      !_.has(user.teacherInfo.workSchedule, 'lunchBreakStart') &&
      !_.has(user.teacherInfo.workSchedule, 'lunchBreakEnd') &&
      user.teacherInfo.workSchedule.unavailableDateTimes.length === 0
    ) {
      renderUnavailabilities(teacherAvailability, setUnavailabilities);
    }
  }, [selectedTeacher, teacherAvailability, user]);

  const handleTeacherAvailabilitySubmit = async () => {
    //validations - no empty or dodgy fields

    if (checkEmptyDateFields('unavailableDateTimes')) {
      setFlashMessage({
        message: `Please fill in all date fields correctly`,
        type: 'error',
        icon: 'alert',
      });
      return null;
    }

    if (checkValidSubDateFields('unavailableDateTimes')) {
      setFlashMessage({
        message: `Please select a valid start/end date time for your unavailability`,
        type: 'error',
        icon: 'alert',
      });
      return null;
    }

    if (
      !moment(teacherAvailability.openingTime).isValid() ||
      !moment(teacherAvailability.closingTime).isValid() ||
      !moment(teacherAvailability.lunchBreakStart).isValid() ||
      !moment(teacherAvailability.lunchBreakEnd).isValid()
    ) {
      setFlashMessage({
        message: `Please fill in all fields and only include valid dates and times`,
        type: 'error',
        icon: 'alert',
      });
      return null;
    }

    // check that end date & times must be greater than start date & times
    if (
      moment(teacherAvailability.closingTime).isSameOrBefore(
        teacherAvailability.openingTime
      )
    ) {
      setFlashMessage({
        message: `Please select a valid closing time`,
        type: 'error',
        icon: 'alert',
      });
      return null;
    }

    if (
      moment(teacherAvailability.openingTime).isSameOrAfter(
        teacherAvailability.closingTime
      )
    ) {
      setFlashMessage({
        message: `Please select a valid opening time`,
        type: 'error',
        icon: 'alert',
      });
      return null;
    }

    if (
      moment(teacherAvailability.lunchBreakStart).isSameOrAfter(
        teacherAvailability.lunchBreakEnd
      )
    ) {
      setFlashMessage({
        message: `Please select a valid lunch break start time`,
        type: 'error',
        icon: 'alert',
      });
      return null;
    }

    if (
      moment(teacherAvailability.lunchBreakEnd).isSameOrBefore(
        teacherAvailability.lunchBreakStart
      )
    ) {
      setFlashMessage({
        message: `Please select a valid lunch break end time`,
        type: 'error',
        icon: 'alert',
      });
      return null;
    }

    const unavailabilityObj = {
      teacherInfo: {
        ...user['teacherInfo'],
        workSchedule: teacherAvailability,
      },
    };

    // delete unavailabilityObj.teacherInfo.workSchedule.errors;
    delete unavailabilityObj.teacherInfo.rating;

    try {
      const response = await updateProfile(unavailabilityObj);
      console.log(response);
      const sanitizedData = omitDeep(response.data, [
        '_id',
        '__v',
        'createdAt',
      ]);
      setUser(sanitizedData);
    } catch (err) {
      console.log(err);
      setFlashMessage({
        message: `Something went wrong, ${err.message}`,
        type: 'error',
        icon: 'alert',
      });
      return null;
    }
  };

  const handleSelect = (e, selTeacher) => {
    const id = selTeacher._id;
    const teacher = teacherList.find(el => el._id === id);
    setFlashMessage(null);
    setClientFormState({
      ...clientFormState,
      teacher: `Dr. ${teacher.firstName} ${teacher.lastName}`,
    });

    setSelectedTeacher(teacher);
  };

  const handleSubmit = async () => {
    //validations

    if (
      !clientFormState.startTime ||
      !clientFormState.endTime ||
      !clientFormState.teacher ||
      !clientFormState.sessionDuration
    ) {
      setFlashMessage({
        message: `Please fill in all fields`,
        type: 'error',
        icon: 'alert',
      });
      return null;
    }

    if (moment(clientFormState.startTime).isSameOrBefore(moment())) {
      setFlashMessage({
        message: `Session booking start time can't be in the past`,
        type: 'error',
        icon: 'alert',
      });
      return null;
    }

    if (
      moment(clientFormState.endTime).isSameOrBefore(
        moment(clientFormState.startTime)
      )
    ) {
      setFlashMessage({
        message: `Session booking start time can't be in the past`,
        type: 'error',
        icon: 'alert',
      });
      return null;
    }

    try {
      const sessionToBook = {
        startTime: moment(clientFormState.startTime).format(
          'YYYY-MM-DD hh:mm a'
        ),
        endTime: moment(clientFormState.endTime).format('YYYY-MM-DD hh:mm a'),
      };

      const response = await request.post(
        `users/${selectedTeacher._id}/book`,
        sessionToBook
      );

      setSessions([{ ...response.data, user: selectedTeacher }, ...sessions]);

      setTabState({
        activeTab: 'schedule',
      });
    } catch (error) {
      setFlashMessage({
        message: `Something went wrong ${error.message}`,
        type: 'error',
        icon: 'alert',
      });
      return null;
    }
  };

  const handleAddClick = (key, formFieldsObject) => {
    setTeacherAvailability({
      ...teacherAvailability,
      [key]: [...teacherAvailability[key], formFieldsObject],
    });
  };

  const handleRemoveClick = (key, i) => {
    //spread value at the formState key into list
    const list = [...teacherAvailability[key]];

    //at index i, remove one item
    list.splice(i, 1);
    setTeacherAvailability({
      ...teacherAvailability,
      [key]: list,
    });
  };

  const handleSessionDuration = (e, duration) => {
    if (e.target.value === duration) {
      const endTime = moment(clientFormState.startTime)
        .add(duration, 'minutes')
        .toDate();

      setClientFormState({
        ...clientFormState,
        sessionDuration: duration,
        endTime,
      });
    }
    setFlashMessage(null);
  };

  const handleUnavailableDateChange = (el, i, key, date, timeBlock) => {
    setFlashMessage(null);

    setTeacherAvailability({
      ...teacherAvailability,
      [key]: teacherAvailability[key].map((element, index) => {
        if (index === i) {
          element[timeBlock] = date;
        }
        return element;
      }),
    });
  };

  const handleUnavailabilityModifiers = (e, i, key) => {
    setFlashMessage(null);

    setTeacherAvailability({
      ...teacherAvailability,
      [key]: teacherAvailability[key].map((element, index) => {
        if (index === i) {
          element['modifier'] = +e.target.value;
        }
        return element;
      }),
    });
  };

  const checkEmptyDateFields = key => {
    let isNotValid;

    teacherAvailability[key].forEach(el => {
      const inputValues = Object.values(el);
      for (let i = 0; i < inputValues.length; i++) {
        if (
          typeof inputValues[i] !== 'string' &&
          !moment(inputValues[i]).isValid()
        ) {
          isNotValid = true;
        }
      }
    });

    return isNotValid;
  };

  const checkValidSubDateFields = key => {
    let isNotValid;

    teacherAvailability[key].forEach(el => {
      const clone = (({ modifier, ...o }) => o)(el);
      if (moment(clone.endDateTime).isSameOrBefore(clone.startDateTime)) {
        isNotValid = true;
      }

      if (moment(clone.startDateTime).isSameOrAfter(clone.endDateTime)) {
        isNotValid = true;
      }
    });

    return isNotValid;
  };

  const renderTeacherAppointments = () => {
    return (
      <div className="appointments-wrapper">
        <section className="calendar-form-wrapper">
          <CalendarForm
            teacherAvailability={teacherAvailability}
            setTeacherAvailability={setTeacherAvailability}
            user={user}
            handleAddClick={handleAddClick}
            handleRemoveClick={handleRemoveClick}
            handleUnavailableDateChange={handleUnavailableDateChange}
            handleUnavailabilityModifiers={handleUnavailabilityModifiers}
            round={round}
            handleTeacherAvailabilitySubmit={handleTeacherAvailabilitySubmit}
            teacherList={teacherList}
            sessions={sessions}
            setSessions={setSessions}
            tabState={tabState}
            setTabState={setTabState}
            handleShowMonday={handleShowMonday}
          />
        </section>
        {tabState.activeTab === 'availability' && (
          <MainCalendar
            user={user}
            unavailabilities={unavailabilities}
            setUnavailabilities={setUnavailabilities}
            vList={teacherList}
            teacherAvailability={teacherAvailability}
            setTeacherAvailability={setTeacherAvailability}
          />
        )}
      </div>
    );
  };

  const renderClientAppointments = () => {
    return (
      <div className="appointments-wrapper">
        <section className="calendar-form-wrapper">
          <CalendarForm
            clientFormState={clientFormState}
            setClientFormState={setClientFormState}
            handleSelect={handleSelect}
            handleSessionDuration={handleSessionDuration}
            user={user}
            teacherList={teacherList}
            selectedTeacher={selectedTeacher}
            setSelectedTeacher={setSelectedTeacher}
            handleSubmit={handleSubmit}
            unavailabilities={unavailabilities}
            sessions={sessions}
            setSessions={setSessions}
            tabState={tabState}
            setTabState={setTabState}
            handleShowMonday={handleShowMonday}
            setUnavailabilities={setUnavailabilities}
          />
        </section>
        {tabState.activeTab === 'availability' && (
          <MainCalendar
            user={user}
            unavailabilities={unavailabilities}
            teacherList={teacherList}
            selectedTeacher={selectedTeacher}
            setUnavailabilities={setUnavailabilities}
            setClientFormState={setClientFormState}
            clientFormState={clientFormState}
          />
        )}
      </div>
    );
  };

  const showAppointmentView = () => {
    return user.isTeacher
      ? renderTeacherAppointments()
      : renderClientAppointments();
  };

  return showAppointmentView();
};

export default Appointments;
