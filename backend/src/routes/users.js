const router = require('express').Router();

const verifyToken = require('./verifyToken');
const {
  signUp,
  signIn,
  signOut,
  signOutAll,
  viewProfile,
  updateProfile,
  deleteProfile,
  viewClients,
  viewClient,
  viewTeachers,
  viewTeacher,
  // createUpload,
} = require('../controllers/usersController');

const { createBooking } = require('../controllers/sessionsController');

router.post('/signup', signUp);

router.post('/signin', signIn);

router.patch('/signout', verifyToken, signOut);

router.patch('/signoutall', verifyToken, signOutAll);

router.get('/profile', verifyToken, viewProfile);

router.patch('/profile', verifyToken, updateProfile);

router.delete('/profile', verifyToken, deleteProfile);
router.get('/clients', verifyToken, viewClients);

router.get('/clients/:id', verifyToken, viewClient);

router.get('/', viewTeachers);

router.get('/:id', viewTeacher);

router.post('/:id/book', verifyToken, createBooking);

module.exports = router;
