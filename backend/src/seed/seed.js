/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable radix */
const seeder = require('mongoose-seed');
const faker = require('faker');
const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: '../../config/.env' });

const schemaDocs = (modelName) => {
  return [
    {
      model: modelName,
      documents: [],
    },
  ];
};

const userDocs = schemaDocs('User');
const sessionDocs = schemaDocs('Session');

const generateUser = () => {
  const sexes = ['male', 'female'];
  const _id = new mongoose.Types.ObjectId();

  return {
    _id,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    sex: _.sample(sexes),
    dateOfBirth: faker.date.past(),
    phoneNumber: faker.phone.phoneNumber(),
    address: {
      number: _.random(1, 250),
      street: faker.address.streetName(),
      city: faker.address.city(),
      state: faker.address.state(),
      country: faker.address.country(),
      postcode: parseInt(faker.address.zipCode()),
    },
    email: faker.internet.email(),
    password: '123456789',
  };
};

const seedClients = (numClients) => {
  const clients = [];

  const clientInfo = {
    titles: ['Dr', 'Mr', 'Mrs', 'Ms', 'Miss', 'Mx', 'Rev', 'Sir'],
    bloodTypes: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    medications: [
      'penicilin',
      'prednisone',
      'metformin',
      'ibuprofen',
      'paracetamol',
    ],
    conditions: [
      'asthma',
      'hypertension',
      'arthritis',
      'diabetes',
      'bronchitis',
      'influenza',
    ],
    allergies: [
      'eggs',
      'milk',
      'peanuts',
      'soy',
      'wheat',
      'shellfish',
      'sesame',
    ],
  };

  for (let i = 0; i < numClients; i += 1) {
    const clientInfoGen = {
      title: _.sample(clientInfo.titles),
      isTeacher: false,
      clientInfo: {
        weight: _.random(40, 100),
        medicalHistory: [
          {
            startDate: faker.date.recent(),
            condition: _.sample(clientInfo.conditions),
            notes: 'Lorem Ipsum',
          },
        ],
        allergies: [
          {
            name: _.sample(clientInfo.allergies),
            severity: _.random(1, 5),
          },
        ],
        medication: [
          {
            name: _.sample(clientInfo.medications),
            dosage: _.random(1, 5),
            manufacturer: faker.company.companyName(),
          },
        ],
        bloodType: _.sample(clientInfo.bloodType),
      },
    };

    const newClient = Object.assign(generateUser(), clientInfoGen);

    clients.push(newClient);

  }

  userDocs[0].documents.push(clients);

  return clients;
};

const seedTeachers = (numTeachers) => {
  const teachers = [];

  const teacherInfo = {
    specialtyFields: [
      'General Practitioner',
      'Cardiology',
      'Paediatrics',
      'Dermatology',
      'Ophthalmology',
      'Endocrinology',
      'Gastroenterology',
      'Oncology',
      'Urology',
      'Gynecology',
    ],
    educations: [
      'University of Sydney',
      'University of New South Wales',
      'University of Newcastle',
      'Western Sydney University',
      'University of Technology Sydney',
      'University of Queensland',
      'University of Melbourne',
      'Monash University',
      'Australian National University',
      'University of Western Australia',
      'University of Wollongong',
    ],
    languages: [
      'English',
      'Mandarin',
      'Spanish',
      'French',
      'Vietnamese',
      'Arabic',
      'Indonesian',
      'Cantonese',
      'Portuguese',
      'German',
    ],
  };

  for (let i = 0; i < numTeachers; i += 1) {
    const teacherInfoGen = {
      title: 'Dr',
      isTeacher: true,
      teacherInfo: {
        licence: 'AustDocL'.concat(_.random(1, 50)).toString(),
        accreditation: ['Teacher of math'],
        specialtyField: _.sample(teacherInfo.specialtyFields),
        subSpecialtyField: _.sample(teacherInfo.specialtyFields),
        education: [_.sample(teacherInfo.educations)],
        yearsExperience: _.random(1, 50),
        languagesSpoken: [_.sample(teacherInfo.languages)],
        rating: Math.floor(Math.random() * 5) + 1,
      },
    };

    const newTeacher = Object.assign(generateUser(), teacherInfoGen);

    teachers.push(newTeacher);
  }

  userDocs[0].documents.push(...teachers);

  return Teachers;
};

const seedFreeSessions = (teachersP) => {
  const setHour = (momentObj, hour) => {
    return momentObj
      .set({ hour, minute: 0, second: 0, millisecond: 0 })
      .valueOf();
  };

  const startDate = moment().add(1, 'days');
  const endDate = moment().add(1, 'months');

  const range = {
    morning: [8, 9],
    afternoon: [12, 14],
  };

  const freeSessionGen = (
    startSession,
    endSession,
    teacher,
    duration = 30,
    restMin = 5
  ) => {
    const sessions = [];

    let startTime = startSession;
    let endTime = moment(0);

    while (endTime.isBefore(endSession)) {
      endTime = moment(startTime).add(duration, 'minutes');

      const session = {
        startTime: moment(startTime).valueOf(),
        endTime: moment(endTime).valueOf(),
        teacher: teacher._id,
      };

      sessions.push(session);

      startTime = endTime.add(restMin, 'minutes');
    }

    return [...sessions];
  };

  teacherP.forEach((teacher) => {
    const sessionBluePrint = (day, rangeP) => {
      return {
        startTime: setHour(day, rangeP[0]),
        endTime: setHour(day, range.morning[1]),
        teacher: teacher._id,
        client: null,
      };
    };

    for (
      let day = moment(startDate);
      day.isBefore(endDate, 'days');
      day.add(1, 'days')
    ) {

      if (day.day() === 0) {
        continue;
      }

      const morningSessions = sessionBluePrint(day, range.morning);
      const afternoonSessions = sessionBluePrint(day, range.afternoon);

      [morningSessions, afternoonSessions].forEach((period) => {
        const freeSessions = freeSessionGen(
          period.startTime,
          period.endTime,
          teacher
        );
        sessionDocs[0].documents.push(freeSessions);

     
      });
    }
  });
};

const seedBookings = (clients, rate = 6) => {
  const sessions = sessionDocs[0].documents;

  console.log('This should be a Session object:', sessions[0]);


  const finalRate = parseInt((rate / 10) * sessions.length, 10);

  const toBookSessions = _.sampleSize(sessions, finalRate);

  toBookSessions.forEach((session) => {
    session.client = _.sample(clients)._id;
  });
};

const runSeeds = () => {
  const clients = seedClients(30);
  const teachers = seedTeachers(10);
  seedFreeSessions(teachers);
  sessionDocs[0].documents = _.flattenDeep(sessionDocs[0].documents);
  seedBookings(clients);
};

runSeeds();

const dbServer = process.env.MONGO_URI;

seeder.connect(dbServer, function () {

  seeder.loadModels(['../models/User.js', '../models/Session.js']);


  seeder.clearModels(['User', 'Session'], function () {
 
    seeder.populateModels(userDocs, function () {
      seeder.populateModels(sessionDocs, function () {
        seeder.disconnect();
      });
    });
  });
});

console.log(`Seeding starts`.green.bold);
