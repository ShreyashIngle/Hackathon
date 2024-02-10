useEffect(() => {
  // console.log(user);

  // Set the Teacher unavails from fetching
  if (
    user.isTeacher &&
    user.teacherInfo.workSchedule
    // && user.teacherInfo.workSchedule.unavailableDateTimes > 0
  ) {
    // console.log('Use Effect 2');
    // Problem number 2 why schedule.unavailabilities ?

    // Getting the unavailabilities of the teacher
    const unavailsRules = user.teacherInfo.workSchedule; // Form Data

    // Conversion (no longer need openingTime losingTime for displaying for RRule, if anything happens ask Harry)
    // Get lunch break
    const lunchBreak = {
      startDateTime: unavailsRules.lunchBreakStart,
      endDateTime: unavailsRules.lunchBreakEnd,
      modifier: RRule.WEEKLY,
      byweekday: workingDays,
    };

    // Spread lunch break with unavails
    const convertedArray = [...unavailsRules.unavailableDateTimes, lunchBreak];

    // console.log(convertedArray);

    // Convert unavailsRules using sanitizeTeacherSessions
    const unavailsRealDatesData = sanitizeTeacherSessions(convertedArray); // Calendar Display Data

    // Set the unavailibities to the unavailsRealDatesData
    setUnavailabilities(unavailsRealDatesData); // Displaying the calendar with data

    // Prefilling the form
    setTeacherAvailability(unavailsRules);
  }
}, []);

useEffect(() => {
  if (
    teacherAvailability.openingTime &&
    teacherAvailability.closingTime &&
    teacherAvailability.lunchBreakStart &&
    teacherAvailability.lunchBreakEnd &&
    teacherAvailability.unavailableDateTimes[0] &&
    teacherAvailability.unavailableDateTimes[0].startDateTime &&
    teacherAvailability.unavailableDateTimes[0].endDateTime &&
    user.isTeacher
  ) {
    console.log('Use Effect 1');
    // Use piping here is also good

    const sanitizedDataObj = convertWorkScheduleToCalendarEvents(
      teacherAvailability
    );

    // Form has already been filled
    setUnavailabilities(sanitizedDataObj); // Displaying data to calendar
  }
}, [teacherAvailability]);

useEffect(() => {
  if (!_.isEmpty(selectedTeacher)) {
    // console.log('Use Effect 2');

    const selectedTeacherUnavailabilites =
      selectedTeacher.teacherInfo.workSchedule;

    console.log(selectedTeacherUnavailabilites);

    const sanitizedDataObj = convertWorkScheduleToCalendarEvents(
      selectedTeacherUnavailabilites
    );
    console.log(sanitizedDataObj);

    // Form has already been filled
    setUnavailabilities(sanitizedDataObj); // Displaying data to calendar
  }
}, [selectedTeacher]);

const normalScheduleAggregrates = availability => {
  // TeacherAvailability = availability

  const unavailableSession = (startDateTime, endDateTime, byweekday) => {
    return {
      startDateTime: startDateTime.toDate(),
      endDatetime: endDateTime.toDate(),
      byweekday: byweekday,
      modifier: RRule.WEEKLY,
    };
  };

  const unavailableMorning = unavailableSession(
    moment.utc(availability.openingTime).startOf('day'),
    moment.utc(availability.openingTime),
    workingDays
  );

  const unavailableLunch = unavailableSession(
    moment.utc(availability.lunchBreakStart),
    moment.utc(availability.lunchBreakEnd),
    workingDays
  );

  const unavailableAfternoon = unavailableSession(
    moment.utc(availability.closingTime),
    moment.utc(availability.closingTime).endOf('day'),
    workingDays
  );

  const unavailableWeekends = unavailableSession(
    moment().day(6).startOf('day'),
    moment().day(7).endOf('day'),
    [RRule.SA]
  );

  const standardUnavailabilities = [
    unavailableMorning,
    unavailableLunch,
    unavailableAfternoon,
    unavailableWeekends,
  ];

  //Available Times
  return standardUnavailabilities;
};

const convertWorkScheduleToCalendarEvents = availability => {
  // TeacherAvailability = availability
  const unavailsAggregate = _.flattenDeep(
    normalScheduleAggregrates(availability),
    availability.unavailableDateTimes
  );

  const sanitizedUnavailabilities = sanitizeTeacherSessions(unavailsAggregate);

  const sanitizedDataObjReturn = convertAPIdataToJS(sanitizedUnavailabilities);
  return sanitizedDataObjReturn;
};
