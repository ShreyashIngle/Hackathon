const router = require('express').Router();
const Joi = require('@hapi/joi'); // Validation
const moment = require('moment');

const User = require('../models/User');
const Session = require('../models/Session');

const verifyToken = require('./verifyToken');
const {
  sessionValidation,
  sessionExists,
  lessThanOneDay,
} = require('../utils/validations/sessions');


router.get('/', verifyToken, async (req, res) => {
  const currentUser = await User.findById(req.user);

  res.json({
    posts: {
      title: 'sample post',
      description: 'lorem ipsum',
      currentUser: currentUser.email,
    },
  });
});

// const sessionValidation = async (isTeacher, reqSession) => {
//  
//   const schema = Joi.object({
//     startTime: Joi.date().timestamp('unix').min('now').required(),
//     endTime: Joi.date().timestamp('unix').required(),
//   });

//   const joiValidation = (data) => {
//     return schema.validate(data);
//   };

//  
//   if (isTeacher) {
//     if (!req.user.isTeacher) {
//       throw new Error('invalid action');
//       // res.status(400).send({ error: 'invalid action' });
//     }
//   } else if (!isTeacher && req.user.isTeacher) {
//     throw new Error('invalid action');
//   }

//   // Validate input
//   const { error } = joiValidation(reqSession);
//   if (error) {
//     throw new Error(error.details[0].message);
//     // return res.status(400).send(error.details[0].message);
//   }

//   // Validation to check whether this time is 30/60 min
//   const startTime = moment.unix(reqSession.startTime);
//   const endTime = moment.unix(reqSession.endTime);
//   const timeDiff = moment.duration(endTime.diff(startTime)).asMinutes();

//   if (!(timeDiff === 30 || timeDiff === 60)) {
//     throw new Error('invalid time range');
//     // res.status(400).send({ error: 'invalid time range' });
//   }

//   // Validation to check whether this time is available for this Teacher
//   const sessions = await Session.find({ Teacher: req.user._id });
//   sessions.forEach((session) => {
//     if (
//       startTime.isBetween(session.startTime, session.endTime) ||
//       endTime.isBetween(session.startTime, session.endTime) ||
//       startTime.isSame(session.startTime) ||
//       endTime.isSame(session.endTime) ||
//       startTime.isSame(session.endTime) ||
//       endTime.isSame(session.startTime)
//     ) {
//       throw new Error('this time is not available');
//       // res.status(400).send({ error: 'this time is not available' });
//     }
//   });
//   return { startTime, endTime };
// };

router.post('/', verifyToken, async (req, res) => {
  try {
    const sessions = req.body;
    sessions.forEach(async (reqSession) => {
      const startTime = moment.unix(reqSession.startTime);
      const endTime = moment.unix(reqSession.endTime);

      const session = new Session({
        startTime,
        endTime,
        teacher: req.user._id,
      });
      await session.save();
    });

    res.send(sessions);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
