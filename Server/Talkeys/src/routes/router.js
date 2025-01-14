const router = require('express').Router();
const auth = require('../middleware/oauth');
const authentication = require('./../controllers/authentication');
const Events= require('./../controllers/event.controller.js')
const Passes= require('./../controllers/passes.controller.js')
const Team= require('./../controllers/team.controller.js')
// event listing 
router.use(authentication.verifyIdToken);
// router.get('/protected', authentication.protected);
/* The code `router.get('/get')` is defining a route for handling GET requests to the '/get' endpoint.
This means that when a GET request is made to the '/get' endpoint of this router, a corresponding
handler function should be called to process the request. However, in the provided code snippet,
there is no handler function specified for this route, so the request to '/get' will not be handled
properly. */
router.get('/getEvents', Events.createEvent)
router.post('/bookPass', Passes.bookTicket)
router.post('/joinTeam', Team.joinTeam)
router.post('/createTeam', Team.createTeam)
//event booking already booked specific account pass reterival

router.get('/logout', authentication.logout);

module.exports = router;