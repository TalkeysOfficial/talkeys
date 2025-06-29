const router = require("express").Router();
const { verifyToken } = require("../middleware/oauth");
const { checkRole } = require("../middleware/role.middleware");
const ctrl = require("../controllers/dashboard.controller");

router.use(verifyToken);

router.get("/profile", ctrl.getProfile);
router.patch("/profile", ctrl.updateProfile);

router.get("/events", ctrl.userEvents);
router.get("/activity", ctrl.recentActivity);

// Event Organizer Routes
router.post("/create-event", checkRole(["event organizer"]), ctrl.createEvent);
router.put("/edit-event/:id", checkRole(["event organizer"]), ctrl.editEvent);
router.patch("/manage-event-details/:id", checkRole(["event organizer"]), ctrl.manageEventDetails);
router.get("/participants/:id", checkRole(["event organizer"]), ctrl.viewParticipants);
router.put("/approve-participant/:id", checkRole(["event organizer"]), ctrl.approveParticipant);
router.get("/export-participants/:id", checkRole(["event organizer"]), ctrl.exportParticipants);
router.get("/event-analytics/:id", checkRole(["event organizer"]), ctrl.getAnalytics);


module.exports = router;
