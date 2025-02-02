const router = require("express").Router();
const auth = require("../middleware/oauth.js");
const authentication = require("./../controllers/authentication.js");
const Events = require("./../controllers/event.controller.js");
const Passes = require("./../controllers/passes.controller.js");
const Team = require("./../controllers/team.controller.js");

const { checkRole } = require("../middleware/role.middleware.js");
const { isTeamOK } = require("../middleware/Team.middleware");
router.get("/getEvents", Events.getEvents);

router.get("/getEventById/:id", Events.getEventById);
router.post("/verify", authentication.login);
router.get("/logout", authentication.logout);

router.use(auth.verifyToken);
router.get("/likeEvent/:id", Events.likeEvent);
router.get("/unlikeEvent/:id", Events.unlikeEvent);
router.get("/getAllLikedEvents", Events.getAllLikedEvents);

router.get("/protected", authentication.protected);
// Changed from createEvent to getEvents since it's a GET request
router.post("/bookPass", Passes.bookTicket);
router.post("/joinTeam", Team.joinTeam);
router.post("/createTeam", Team.createTeam);
router.post("/getPass", Passes.getPassByUserAndEvent);
router.post("/getTeam", Team.getTeam);

router.use(checkRole(["admin"]));
router.get("/CanScan", Passes.canScan);
router.post("/verifyPass", Passes.getPlayerByPassId);
router.post("/reject", Passes.Reject);
router.post("/accept", Passes.Accept);
module.exports = router;
