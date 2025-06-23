const router = require("express").Router();
const auth = require("../middleware/oauth.js");
const authentication = require("./../controllers/authentication.js");
const Events = require("./../controllers/event.controller.js");
const Passes = require("./../controllers/passes.controller.js");
const Team = require("./../controllers/team.controller.js");
const contact = require("./../controllers/contact.controller.js");
const { checkRole } = require("../middleware/role.middleware.js");
const { isTeamOK } = require("../middleware/Team.middleware");
const {
	initiatePayment,
	verifyPayment,
	getPaymentResult,
} = require("./../controllers/payment.controller.js");

router.get("/getEvents", Events.getEvents);
router.use("/dashboard", require("./dashboard.routes"));

router.get("/getEventById/:id", Events.getEventById);
router.post("/verify", authentication.login);
router.get("/logout", authentication.logout);

router.post("/register",Passes.register); 
router.use(auth.verifyToken);


router.get("/likeEvent/:id", Events.likeEvent);
router.get("/unlikeEvent/:id", Events.unlikeEvent);
router.get("/getAllLikedEvents", Events.getAllLikedEvents);
router.post("contactUs", contact.contactUs);
router.get("/protected", authentication.protected);
// Changed from createEvent to getEvents since it's a GET request
router.post("/bookPass", Passes.bookTicket);
router.post("/joinTeam", Team.joinTeam);
router.post("/createTeam", Team.createTeam);
router.post("/getPass", Passes.getPassByUserAndEvent);
router.post("/getTeam", Team.getTeam);
router.post("/reqEvent", Events.reqEventt);


router.use(checkRole(["admin"]));


router.get("/CanScan", Passes.canScan);
router.post("/verifyPass", Passes.getPlayerByPassId);
router.post("/reject", Passes.Reject);
router.post("/accept", Passes.Accept);
router.post("/payment/:bookingId", initiatePayment);
router.post("/payment/verify", verifyPayment);
router.post("/payment/result", getPaymentResult);

// mera code matt hattayo
router.post("/addEvent", Events.addEvent);
router.delete("/deleteSpecificEvent/:eventId", Events.deleteSpecificEvent);

module.exports = router;
