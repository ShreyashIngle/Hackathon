
const Joi = require('@hapi/joi'); // Validation
const moment = require('moment');

const Session = require('../../models/Session');

const schema = Joi.object({
  startTime: Joi.date().min('now').required(),
  endTime: Joi.date().min('now').required(),
});

const sessionValidation = async (req, session) => {
  const joiValidation = (sessionParam) => {
    return schema.validate(sessionParam);
  };

  const { error } = joiValidation(session);
  if (error) {
    throw new Error(error.details[0].message);
  }

  const startTime = moment(session.startTime);
  const endTime = moment(session.endTime);
  const timeDiff = moment.duration(endTime.diff(startTime)).asMinutes();

  // // console.log({ startTime, endTime });
  // // console.log(timeDiff);

  if (!(timeDiff === 30 || timeDiff === 60)) {
    throw new Error('invalid time range');
  }

  const sessions = await Session.find({ teacher: req.params.id });
  sessions.forEach((sessionEach) => {
    console.log('running...');
    if (
      startTime.isBetween(sessionEach.startTime, sessionEach.endTime) ||
      endTime.isBetween(sessionEach.startTime, sessionEach.endTime) ||
      startTime.isSame(sessionEach.startTime) ||
      endTime.isSame(sessionEach.endTime) ||
      startTime.isSame(sessionEach.endTime) ||
      endTime.isSame(sessionEach.startTime)
    ) {
      throw new Error('this time is not available');
    }
  });


  return { startTime, endTime };
};

exports.sessionsValidationMethod1 = (req, sessions) => {
  const sessionsArray = [];

  sessions.forEach((session) => {
    sessionsArray.push(sessionValidation(req, session));
  });

  return sessionsArray;
};

exports.sessionsValidationMethod2 = async (req, sessions) => {
  const sessionsArray = [];

  for (const session of sessions) {
    const { startTime, endTime } = await sessionValidation(req, session);

    const newSession = new Session({
      startTime,
      endTime,
      teacher: req.user._id,
    });

    await newSession.save();

    sessionsArray.push({
      startTime: moment(startTime).toDate(),
      endTime: moment(endTime).toDate(),
    });
  }
  return sessionsArray;
};

exports.sessionExists = async (req) => {
  const session = await Session.findById(req.params.id, function (err) {
    if (err) {
      throw new Error('resource does not exist');
    }
  });
  return session;
};

exports.lessThanOneDay = (sessionStartTime) => {
  const currentTime = moment();
  const oneDayAhead = currentTime.add(1, 'days');
  const lessThanOneDayVar = oneDayAhead.isAfter(sessionStartTime);

  if (lessThanOneDayVar) {
    throw new Error('cannot change schedule if booking is within 24 hrs');
  }

};

exports.isTeacherValidation = (req, isTeacher) => {
  if (isTeacher && !req.user.isTeacher) {
    throw new Error({ error: 'invalid action' });
  } else if (!isTeacher && req.user.isTeacher) {
    throw new Error({ error: 'invalid action' });
  }
};

exports.sessionValidation = sessionValidation;
