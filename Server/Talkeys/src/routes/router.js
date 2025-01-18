const router = require('express').Router();
const auth = require('../middleware/oauth.js');
const authentication = require('./../controllers/authentication');
const Events = require('./../controllers/event.controller.js');
const Passes = require('./../controllers/passes.controller.js');
const Team = require('./../controllers/team.controller.js');
const { verifyToken } = require('../controllers/authentication');
const {checkRole} = require('../middleware/roleCheck');
const { isTeamOK } = require('../middleware/Team.middleware');
router.use(authentication.verifyToken);
router.get('/protected', authentication.protected);
// Changed from createEvent to getEvents since it's a GET request
router.get('/getEvents', Events.getEvents);  
router.post('/bookPass', Passes.bookTicket);

router.post('/joinTeam', Team.joinTeam);
router.post('/createTeam', Team.createTeam);

router.get('/logout', authentication.logout);

module.exports = router;