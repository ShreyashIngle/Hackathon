/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */

const seeder = require('mongoose-seed');
const faker = require('faker');
const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
require('colors');
const dotenv = require('dotenv');
const { RRule } = require('rrule');

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

const usersList = {
  mc: ['male', 'client', 39],
  md: ['male', 'teacher', 42],
  fc: ['female', 'client', 40],
  fd: ['female', 'teacher', 43],
};

const generateUser = (sex) => {
  const _id = new mongoose.Types.ObjectId();
  const firstName = faker.name.firstName(sex);
  const lastName = faker.name.lastName();

  return {
    _id,
    firstName,
    lastName,
    sex,
    dateOfBirth: moment()
      .subtract(_.random(30, 70), 'years')
      .format('YYYY-MM-DD'),
    phoneNumber: faker.phone.phoneNumber(),
    address: {
      number: _.random(1, 250),
      street: faker.address.streetName(),
      city: faker.address.city(),
      state: faker.address.state(),
      country: faker.address.country(),
      postcode: parseInt(faker.address.zipCode(), 10),
    },
    email: faker.internet.email(
      firstName.toLowerCase(),
      lastName.toLowerCase(),
      'gmail.com'
    ),
    password: '123456789',
  };
};


const generateWorkSchedule = () => {
  const openingTimes = [5, 6, 7, 8, 9]; // _.random(5, 9);
  const closingTimes = [17, 18, 19, 20, 21, 22, 23];
  const lunchBreakStartTimes = [11, 12, 13, 14, 15];
  const randomHours = [1, 2, 3];
  const randomDays = [1, 2, 3, 4];

  const openingTime = moment()
    .set({ hour: _.sample(openingTimes), minute: 0 })
    .format();

  const closingTime = moment()
    .set({ hour: _.sample(closingTimes), minute: 0 })
    .format();

  const lunchBreakStart = moment()
    .set({ hour: _.sample(lunchBreakStartTimes), minute: 0 })
    .format();

  const lunchBreakEnd = moment(lunchBreakStart).add(1, 'hour').format();

  const unavailableStartDateTimePostLunch = moment(lunchBreakEnd)
    .add({ hour: _.sample(randomHours), days: _.sample(randomDays) })
    .format();

  const unavailableEndDateTimePostLunch = moment(
    unavailableStartDateTimePostLunch
  )
    .add(_.sample(randomHours), 'hour')
    .format();


  const unavailableStartDateTimePreLunch = moment(openingTime)
    .add({ hour: _.sample(randomHours), days: _.sample(randomDays) })
    .format();

  const unavailableEndDateTimePreLunch = moment(
    unavailableStartDateTimePreLunch
  )
    .add(_.sample(randomHours), 'hour')
    .format();

  return {
    openingTime,
    closingTime,
    lunchBreakStart,
    lunchBreakEnd,
    unavailableDateTimes: [
      {
        startDateTime: unavailableStartDateTimePostLunch,
        endDateTime: unavailableEndDateTimePostLunch,
        modifier: RRule.WEEKLY,
      },
      {
        startDateTime: unavailableStartDateTimePreLunch,
        endDateTime: unavailableEndDateTimePreLunch,
        modifier: RRule.WEEKLY,
      },
    ],
  };
};

const addRoleInfo = {
  client: () => {
    const clientInfo = {
      titles: ['Dr', 'Mr', 'Mrs', 'Ms', 'Miss', 'Mx', 'Rev', 'Sir'],
      bloodTypes: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      medications: [
        'penicilin',
        'prednisone',
        'metformin',
        'ibuprofen',
        'paracetamol',
        'Doxycycline',
        'Dupixent',
        'Entresto',
        'Entyvio',
        'Farxiga',
        'Gabapentin',
        'Gilenya',
        'Humira',
        'Hydrochlorothiazide',
        'Ibuprofen',
        'Imbruvica',
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

    return {
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
            dosage: _.random(10, 500),
            manufacturer: faker.company.companyName(),
          },
        ],
        bloodType: _.sample(clientInfo.bloodTypes),
      },
    };
  },
  deacher: () => {
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

    return {
      title: 'Dr',
      isTeacher: true,
      teacherInfo: {
        workSchedule: generateWorkSchedule(),
        licence: 'AustDocL'.concat(_.random(1, 50)).toString(),
        accreditations: ['Teacher of Maths'],
        specialtyField: _.sample(teacherInfo.specialtyFields),
        subSpecialtyField: _.sample(teacherInfo.specialtyFields),
        education: [_.sample(teacherInfo.educations)],
        yearsExperience: _.random(1, 50),
        languagesSpoken: [_.sample(teacherInfo.languages)],
        rating: Math.floor(Math.random() * 5) + 1,
      },
    };
  },
};

const userSeed = () => {
  Object.entries(usersList).forEach(([key, [sex, role, count]], i) => {
    // // Check if assignment is correct
    console.log(key, sex, role, `Count: ${count}`, i);

    for (let k = 1; k < count + 1; k += 1) {
      // Generate user
      let user = generateUser(sex);

  
      const roleInfo = addRoleInfo[role]();
      user = { ...user, ...roleInfo };

     
      user.profileImage = `https://s3-cloudclinic.s3-ap-southeast-2.amazonaws.com/avatars/${key}-${k}.jpg`;

  
      userDocs[0].documents.push(user);
      
    }
  });
};

const runSeeds = () => {

  userSeed();
  // console.log(userDocs[0].documents);


};

runSeeds();

const dbServer = process.env.MONGO_URI;


seeder.connect(dbServer, function () {

  seeder.loadModels(['../models/User.js']);


  seeder.clearModels(['User'], function () {

    seeder.populateModels(userDocs, function () {
      seeder.disconnect();
    });
  });
});

console.log(`Seeding starts`.green.bold);
