import axios from 'axios';
import faker from 'faker';

const email = () => faker.internet.email();
const newEmailClient = email();
const newEmailTeacher = email();

export const url = 'http://localhost:5000';

export const request = axios.create({
  baseURL: `${url}/api/`,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: localStorage.getItem('medBookJWT'),
  },
});

export const JWTHeader = {
  headers: {
    Authorization: localStorage.getItem('medBookJWT'),
  },
};

export const JSONHeader = {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
};

const link = faker.image.imageUrl();

export const newUserClient = {
 
};

export const newUserTeacher = {

};
