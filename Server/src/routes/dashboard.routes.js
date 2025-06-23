const router = require("express").Router();
const { verifyToken } = require("../middleware/oauth");
const ctrl = require("../controllers/dashboard.controller");

router.use(verifyToken);

router.get("/profile", ctrl.getProfile);
router.patch("/profile", ctrl.updateProfile);

router.get("/events", ctrl.userEvents);
router.get("/activity", ctrl.recentActivity);

module.exports = router;
