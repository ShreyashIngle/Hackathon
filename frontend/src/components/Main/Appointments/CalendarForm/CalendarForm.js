import React, { useContext } from 'react';
import { MessageContext } from '../../../../globalState/index';
import DatePicker from 'react-datepicker';
import { Clock, Calendar } from 'react-feather';
import _ from 'lodash';
import 'react-datepicker/dist/react-datepicker.css';
import '../../Authentication/Form/Form.scss';
import './CalendarForm.scss';
// import AuthSelect from '../../Authentication/Form/AuthSelect/AuthSelect';
import Button from '../../../Button/Button';
import moment from 'moment';
import Schedule from '../Schedule/Schedule';
// import { RRule } from 'rrule';
import DropSelect from './DropSelect/DropSelect';

const CalendarForm = ({
  clientFormState,
  setClientFormState,
  handleSelect,
  handleSessionDuration,
  teacherAvailability,
  setTeacherAvailability,
  handleAddClick,
  handleRemoveClick,
  handleUnavailableDateChange,
  setUnavailabilities,
  user,
  round,
  setSelectedTeacher,
  handleUnavailabilityModifiers,
  handleTeacherAvailabilitySubmit,
  teacherList,
  handleSubmit,
  selectedTeacher,
  tabState,
  setTabState,
  sessions,
  setSessions,
  handleShowMonday,
}) => {
  const { setFlashMessage } = useContext(MessageContext);

  let handleColor = time => {
    return time.getHours() > 12 ? 'text-success' : 'text-error';
  };

  const displaySessionTime = () => {
    if (clientFormState.startTime) {
      const sessionStart = moment(clientFormState.startTime).format(
        'dddd Do MMM h:mm'
      );
      const sessionEnd = moment(clientFormState.endTime).format('h:mm a');
      return `${sessionStart} - ${sessionEnd}`;
    } else {
      return '';
    }
  };

  const isWeekday = date => {
    const day = moment(date).day();
    return day !== 0 && day !== 6;
  };

  const TeacherForm = () => {
    return (
      <div className="tab-wrapper">
        <div className="tab-container">
          <h5
            className={
              tabState.activeTab === 'availability' ? 'active' : undefined
            }
            onClick={() =>
              setTabState({
                activeTab: 'availability',
              })
            }
          >
            Availability
          </h5>
          <h5
            className={tabState.activeTab === 'schedule' ? 'active' : undefined}
            onClick={() =>
              setTabState({
                activeTab: 'schedule',
              })
            }
          >
            Schedule
          </h5>
        </div>
        <div className="form-wrapper">
          <div className="tabs"></div>
          <div className="trim" />
          <div
            className={
              tabState.activeTab === 'availability'
                ? 'form-container'
                : undefined
            }
          >
            <div
              className={
                tabState.activeTab === 'availability' ? undefined : 'hidden'
              }
            >
              <div className="form-header">
                <h1>Set your unavailability</h1>
              </div>
              <div>
                <h4>Select your working hours</h4>
                <div className="react-datepicker-master-wrapper">
                  <div className="start-end-time-wrapper">
                    <div className="start-end-time-container">
                      <h5>Open</h5>
                      <div className="lunch-time">
                        <Clock color="#212429" size={14} />
                        <DatePicker
                          selected={
                            teacherAvailability
                              ? moment(teacherAvailability.openingTime).toDate()
                              : null
                          }
                          onChange={date => {
                            setTeacherAvailability({
                              ...teacherAvailability,
                              openingTime: moment(date).toDate(),
                            });

                            setFlashMessage(null);
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          placeholder="Opening Time"
                          minTime={moment().hours(5).minutes(0)._d}
                          maxTime={moment().hours(22).minutes(0)._d}
                          timeIntervals={15}
                          filterDate={isWeekday}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                        />
                      </div>
                    </div>
                    <div className="start-end-time-container">
                      <h5>Close</h5>
                      <div className="lunch-time">
                        <Clock color="#212429" size={14} />
                        <DatePicker
                          selected={
                            teacherAvailability
                              ? moment(teacherAvailability.closingTime).toDate()
                              : null
                          }
                          onChange={date => {
                            setTeacherAvailability({
                              ...teacherAvailability,

                              closingTime: moment(date).toDate(),
                            });
                            setFlashMessage(null);
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          placeholder="Opening Time"
                          minTime={
                            teacherAvailability
                              ? moment(teacherAvailability.openingTime)
                                  .add(1, 'hour')
                                  .toDate()
                              : null
                          }
                          maxTime={moment().hours(23).minutes(0)._d}
                          timeIntervals={15}
                          filterDate={isWeekday}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4>Select your lunch break hours</h4>
                <div className="react-datepicker-master-wrapper">
                  <div className="start-end-time-wrapper">
                    <div className="start-end-time-container">
                      <h5>Start</h5>
                      <div className="lunch-time">
                        <Clock color="#212429" size={14} />
                        <DatePicker
                          selected={
                            teacherAvailability
                              ? moment(
                                teacherAvailability.lunchBreakStart
                                ).toDate()
                              : null
                          }
                          onChange={date => {
                            setTeacherAvailability({
                              ...teacherAvailability,
                              lunchBreakStart: moment(date).toDate(),
                            });
                            setFlashMessage(null);
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          minTime={moment().hours(10).minutes(0)._d}
                          maxTime={moment().hours(16).minutes(0)._d}
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                        />
                      </div>
                    </div>
                    <div className="start-end-time-container">
                      <h5>End</h5>
                      <div className="lunch-time">
                        <Clock color="#212429" size={14} />
                        <DatePicker
                          selected={
                            teacherAvailability
                              ? moment(
                                teacherAvailability.lunchBreakEnd
                                ).toDate()
                              : null
                          }
                          onChange={date => {
                            setTeacherAvailability({
                              ...teacherAvailability,
                              lunchBreakEnd: moment(date).toDate(),
                            });
                            setFlashMessage(null);
                          }}
                          showTimeSelect
                          showTimeSelectOnly
                          minTime={moment().hours(10).minutes(0)._d}
                          maxTime={moment().hours(16).minutes(0)._d}
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4>Select your unavailability</h4>
                <div className="react-datepicker-master-wrapper">
                  {teacherAvailability &&
                  teacherAvailability.unavailableDateTimes.length > 0 ? (
                    teacherAvailability.unavailableDateTimes.map((el, i) => {
                      return (
                        <div key={i}>
                          <div className="start-end-time-wrapper">
                            <div className="start-end-time-container">
                              <h5>Start date and time</h5>
                              <div className="lunch-time">
                                <Calendar color="#212429" size={14} />
                                <DatePicker
                                  selected={
                                    teacherAvailability
                                      ? moment(
                                        teacherAvailability
                                            .unavailableDateTimes[i]
                                            .startDateTime
                                        ).toDate()
                                      : null
                                  }
                                  onChange={date =>
                                    handleUnavailableDateChange(
                                      el,
                                      i,
                                      'unavailableDateTimes',
                                      moment(date).toDate(),
                                      'startDateTime'
                                    )
                                  }
                                  showTimeSelect
                                  minDate={moment().toDate()}
                                  maxDate={moment().add(3, 'year').toDate()}
                                  filterDate={isWeekday}
                                  // // Format ?
                                  minTime={
                                    teacherAvailability
                                      ? moment(
                                        teacherAvailability.openingTime
                                        ).toDate()
                                      : null
                                  }
                                  maxTime={moment()
                                    .hours(23)
                                    .minutes(0)
                                    .toDate()}
                                  timeIntervals={15}
                                  timeCaption="Time"
                                  dateFormat="MMMM d, h:mm aa"
                                  // dateFormat="h:mm aa"
                                />
                              </div>
                            </div>
                            <div className="start-end-time-container">
                              <h5>End date and time</h5>
                              <div className="lunch-time">
                                <Calendar color="#212429" size={14} />
                                <DatePicker
                                  selected={
                                    teacherAvailability
                                      ? moment(
                                        teacherAvailability
                                            .unavailableDateTimes[i].endDateTime
                                        ).toDate()
                                      : null
                                  }
                                  onChange={date =>
                                    handleUnavailableDateChange(
                                      el,
                                      i,
                                      'unavailableDateTimes',
                                      moment(date).toDate(),
                                      'endDateTime'
                                    )
                                  }
                                  showTimeSelect
                                  showTimeSelectOnly
                                  minDate={moment().toDate()}
                                  maxDate={moment().add(3, 'year').toDate()}
                                  // // Format ?
                                  minTime={
                                    teacherAvailability.openingTime
                                      ? moment(
                                        teacherAvailability.openingTime
                                        ).toDate()
                                      : null
                                  }
                                  maxTime={moment()
                                    .hours(23)
                                    .minutes(0)
                                    .toDate()}
                                  timeIntervals={15}
                                  timeCaption="Time"
                                  filterDate={isWeekday}
                                  // dateFormat="MMMM d, h:mm aa"
                                  dateFormat="h:mm aa"
                                />
                              </div>
                            </div>
                          </div>
                          <div id="appointment-form-button-wrapper">
                            <div className="grid-item">
                              <div className="radio-group">
                                {/* <div className="option">
                                  <input
                                    type="radio"
                                    id="everyWeek"
                                    name={`weekly${i}`}
                                    value={RRule.WEEKLY} // RRule.WEEKLY
                                    checked={
                                     teacherAvailability.unavailableDateTimes[i]
                                        .modifier === RRule.WEEKLY
                                    }
                                    onChange={e =>
                                      handleUnavailabilityModifiers(
                                        e,
                                        i,
                                        'unavailableDateTimes'
                                      )
                                    }
                                  />
                                  <label htmlFor={`weekly${i}`}>
                                    Every Week
                                  </label>
                                </div> */}
                                {/* <div className="option">
                                  <input
                                    type="radio"
                                    id="other"
                                    name={`daily${i}`}
                                    value={RRule.DAILY} // RRule.DAILY
                                    checked={
                                      teacherAvailability.unavailableDateTimes[i]
                                        .modifier === RRule.DAILY
                                    }
                                    onChange={e =>
                                      handleUnavailabilityModifiers(
                                        e,
                                        i,
                                        'unavailableDateTimes'
                                      )
                                    }
                                  />
                                  <label htmlFor={`daily${i}`}>Daily</label>
                                </div> */}
                                <div className="option">
                                  <input
                                    type="radio"
                                    id="other"
                                    name={`single${i}`}
                                    value={0} // One off event
                                    checked={
                                      teacherAvailability.unavailableDateTimes[i]
                                        .modifier === 0
                                    }
                                    onChange={e =>
                                      handleUnavailabilityModifiers(
                                        e,
                                        i,
                                        'unavailableDateTimes'
                                      )
                                    }
                                  />
                                  <label htmlFor={`single${i}`}>Single</label>
                                </div>
                              </div>
                            </div>
                            <div className="grid-item">
                              {teacherAvailability.unavailableDateTimes
                                .length !== 1 && (
                                <Button
                                  onClick={() =>
                                    handleRemoveClick('unavailableDateTimes', i)
                                  }
                                  icon="minus"
                                  color="mid"
                                />
                              )}
                              {teacherAvailability.unavailableDateTimes.length -
                                1 ===
                                i && (
                                <Button
                                  onClick={() =>
                                    teacherAvailability.unavailableDateTimes[i]
                                      .startDateTime !== '' &&
                                    handleAddClick('unavailableDateTimes', {
                                      startDateTime: round(
                                        handleShowMonday(),
                                        moment.duration(15, 'minutes'),
                                        'ceil'
                                      ).toDate(),
                                      endDateTime: round(
                                        handleShowMonday().add({ minutes: 30 }),
                                        moment.duration(15, 'minutes'),
                                        'ceil'
                                      ).toDate(),
                                      modifier: 0,
                                    })
                                  }
                                  icon="plus"
                                  color="mid"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div id="appointment-form-button-wrapper">
                      <div className="grid-item">
                        <Button
                          onClick={() =>
                            handleAddClick('unavailableDateTimes', {
                              startDateTime: round(
                                moment(),
                                moment.duration(15, 'minutes'),
                                'ceil'
                              ).toDate(),
                              endDateTime: round(
                                moment(),
                                moment.duration(15, 'minutes'),
                                'ceil'
                              ).toDate(),
                              modifier: 0,
                            })
                          }
                          icon="plus"
                          color="mid"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-button-wrapper">
                <Button
                  action="Confirm"
                  color="dark blue"
                  onClick={() => handleTeacherAvailabilitySubmit()}
                  icon="check"
                />
              </div>
            </div>
            <div
              className={
                tabState.activeTab === 'availability' ? 'hidden' : undefined
              }
            >
              <Schedule
                user={user}
                sessions={sessions}
                setSessions={setSessions}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ClientForm = () => {
    return (
      <div className="tab-wrapper">
        <div className="tab-container">
          <h5
            className={
              tabState.activeTab === 'availability' ? 'active' : undefined
            }
            onClick={() =>
              setTabState({
                activeTab: 'availability',
              })
            }
          >
            Bookings
          </h5>
          <h5
            className={tabState.activeTab === 'schedule' ? 'active' : undefined}
            onClick={() =>
              setTabState({
                activeTab: 'schedule',
              })
            }
          >
            Schedule
          </h5>
        </div>
        <div className="form-wrapper">
          <div className="trim" />
          <div
            className={
              tabState.activeTab === 'availability'
                ? 'form-container'
                : undefined
            }
          >
            <div
              className={
                tabState.activeTab === 'availability' ? undefined : 'hidden'
              }
            >
              <div className="form-header">
                <h1>Make an appointment</h1>
              </div>
              <div>
                {/* <AuthSelect
                  value={clientFormState.teacher}
                  placeholder="Deacher"
                  type="text"
                  icon="userPlus"
                  directive="teacherList"
                  options={teacherList}
                  onValueChange={e => handleSelect(e, 'teacher')}
                  teacherList={teacherList}
                /> */}

                <DropSelect
                  teacherList={teacherList}
                  setClientFormState={setClientFormState}
                  handleSelect={handleSelect}
                  clientFormState={clientFormState}
                  setSelectedTeacher={setSelectedTeacher}
                  setUnavailabilities={setUnavailabilities}
                />
                <h4>Select an appointment date and time</h4>
                <div className="react-datepicker-master-wrapper">
                  <Clock color="#212429" size={14} />
                  <DatePicker
                    name="date"
                    popperPlacement="bottom-end"
                    placeholderText="Click to select a date and time"
                    showTimeSelect
                    selected={clientFormState.startTime}
                    minDate={moment().toDate()}
                    maxDate={moment().add(1, 'year').toDate()}
                    minTime={
                      !_.isEmpty(selectedTeacher) &&
                      moment(
                        selectedTeacher.teacherInfo.workSchedule.openingTime
                      ).toDate()
                    }
                    maxTime={
                      !_.isEmpty(selectedTeacher) &&
                      moment(
                        selectedTeacher.teacherInfo.workSchedule.closingTime
                      ).toDate()
                    }
                    onChange={date => {
                      setClientFormState({
                        ...clientFormState,
                        startTime: date,
                        endTime: moment(date)
                          .add(clientFormState.sessionDuration, 'minutes')
                          .toDate(),
                      });
                      setFlashMessage(null);
                    }}
                    timeClassName={handleColor}
                    filterDate={isWeekday}
                    dateFormat="MMMM d, h:mm aa"
                  />
                </div>
                <h4>Select a duration</h4>
                <fieldset className="appointment-time-slot-wrapper">
                  <div className="time-slot">
                    <div>
                      <input
                        type="radio"
                        name="duration"
                        id=""
                        checked={clientFormState.sessionDuration === '30'}
                        value="30"
                        onChange={e => handleSessionDuration(e, '30')}
                      />
                      <span>30 min</span>
                    </div>
                    <span className="appointment-time">
                      {clientFormState.sessionDuration === '30'
                        ? displaySessionTime()
                        : ''}
                    </span>
                  </div>
                  <div className="time-slot">
                    <div>
                      <input
                        type="radio"
                        name="duration"
                        id=""
                        checked={clientFormState.sessionDuration === '60'}
                        value="60"
                        onChange={e => handleSessionDuration(e, '60')}
                      />
                      <span>60 min</span>
                    </div>
                    <span className="appointment-time">
                      {clientFormState.sessionDuration === '60'
                        ? displaySessionTime()
                        : ''}
                    </span>
                  </div>
                </fieldset>
              </div>
              <div className="form-button-wrapper">
                <Button
                  action="Confirm"
                  color="dark blue"
                  onClick={handleSubmit}
                  icon="check"
                />
              </div>
            </div>
            <div
              className={
                tabState.activeTab === 'availability' ? 'hidden' : undefined
              }
            >
              <Schedule
                user={user}
                sessions={sessions}
                setSessions={setSessions}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const showForm = () => {
    return user.isTeacher ? TeacherForm() : ClientForm();
  };
  return showForm();
};

export default CalendarForm;
