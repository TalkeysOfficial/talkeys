const router = require("express").Router();
const { verifyToken } = require("../middleware/oauth");
const { checkRole } = require("../middleware/role.middleware");
const ctrl = require("../controllers/dashboard.controller");

// All routes require user to be logged in
router.use(verifyToken);

// Routes available to all logged-in users
router.get("/profile", ctrl.getProfile);
router.patch("/profile", ctrl.updateProfile);
router.get("/events", ctrl.userEvents);
router.get("/activity", ctrl.recentActivity);

// Routes only accessible to organizers
router.use(checkRole(["organizer"]));

router.post("/create-event", ctrl.createEvent);
router.put("/edit-event/:id", ctrl.editEvent);
router.get("/participants/:id", ctrl.viewParticipants);
router.put("/approve-participant/:id", ctrl.approveParticipant);
router.get("/export-participants/:id", ctrl.exportParticipants);
router.get("/event-analytics/:id", ctrl.getAnalytics);

module.exports = router;
