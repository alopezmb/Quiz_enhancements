const express = require('express');
const router = express.Router();

const quizController = require('../controllers/quiz');
const tipController = require('../controllers/tip');
const userController = require('../controllers/user');
const sessionController = require('../controllers/session');

//-----------------------------------------------------------

// autologout
router.all('*',sessionController.deleteExpiredUserSession);

//-----------------------------------------------------------

// History: Restoration routes.

// Redirection to the saved restoration route.
function redirectBack(req, res, next) {
    const url = req.session.backURL || "/";
    delete req.session.backURL;
    res.redirect(url);
}

router.get('/goback', redirectBack);

// Save the route that will be the current restoration route.
function saveBack(req, res, next) {
    req.session.backURL = req.url;
    next();
}

// Restoration routes are GET routes that do not end in:
//   /new, /edit, /play, /check, /session, or /:id.
router.get([
    '/',
    '/author',
    '/users',
    '/users/:id(\\d+)/quizzes',
    '/quizzes'], saveBack);

//-----------------------------------------------------------

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

// Author page.
router.get('/author', (req, res, next) => {
    res.render('author');
});


// Autoload for routes using :quizId, :userId and :tipId
router.param('quizId', quizController.load);
router.param('userId', userController.load);
router.param('tipId',  tipController.load);


// Routes for the resource /session
router.get('/session',    sessionController.new);     // login form
router.post('/session',   sessionController.create);  // create sesion
router.delete('/session', sessionController.destroy); // close sesion


// Routes for the resource /users
router.get('/users',
    sessionController.loginRequired,
	userController.index);
router.get('/users/:userId(\\d+)',
    sessionController.loginRequired,
	userController.show);
router.get('/users/new',
	userController.new);
router.post('/users',
	userController.create);
router.get('/users/:userId(\\d+)/edit',
    sessionController.loginRequired,
    sessionController.adminOrMyselfRequired,
	userController.edit);
router.put('/users/:userId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminOrMyselfRequired,
	userController.update);
router.delete('/users/:userId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminOrMyselfRequired,
	userController.destroy);

router.get('/users/:userId(\\d+)/quizzes',
    sessionController.loginRequired,
    quizController.index);


// Routes for the resource /quizzes
router.get('/quizzes',
	quizController.index);
router.get('/quizzes/:quizId(\\d+)',
	quizController.show);
router.get('/quizzes/new',
    sessionController.loginRequired,
	quizController.new);
router.post('/quizzes',
    sessionController.loginRequired,
	quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',
    sessionController.loginRequired,
    quizController.adminOrAuthorRequired,
	quizController.edit);
router.put('/quizzes/:quizId(\\d+)',
    sessionController.loginRequired,
    quizController.adminOrAuthorRequired,
	quizController.update);
router.delete('/quizzes/:quizId(\\d+)',
    sessionController.loginRequired,
    quizController.adminOrAuthorRequired,
	quizController.destroy);

router.get('/quizzes/:quizId(\\d+)/play',  quizController.play);
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);



//randomplay and randomcheck practica6
router.get('/quizzes/randomplay',quizController.create_countdown,tipController.tip_preparation, quizController.randomplay);
router.get('/quizzes/randomcheck/:quizId(\\d+)',quizController.create_countdown,  quizController.randomcheck);

//render edit view and add tip changes to database practica8
router.get('/quizzes/:quizId(\\d+)/tips/:tipId(\\d+)/edit',sessionController.loginRequired,
    tipController.adminOrAuthorRequired,tipController.edit);
router.put('/quizzes/:quizId(\\d+)/tips/:tipId(\\d+)',sessionController.loginRequired,
	tipController.adminOrAuthorRequired,tipController.update);

//added functionalities

router.get('/quizzes/randomplay/countdown', quizController.countdown); //ajax controller for countdown
router.get('/quizzes/randomplay/timeup', quizController.timeup); //time up page renderer mw
router.get('/quizzes/randomplay/randomtip', tipController.randomtip);





router.post('/quizzes/:quizId(\\d+)/tips',
    sessionController.loginRequired,
    tipController.create);
router.put('/quizzes/:quizId(\\d+)/tips/:tipId(\\d+)/accept',
    sessionController.loginRequired,
    quizController.adminOrAuthorRequired,
    tipController.accept);
router.delete('/quizzes/:quizId(\\d+)/tips/:tipId(\\d+)',
    sessionController.loginRequired,
    quizController.adminOrAuthorRequired,
    tipController.destroy);


module.exports = router;
