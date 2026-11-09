const router = require("express").Router();
const express = require("express");
const auth = require("../shared/middleware/oauth.js");
const authentication = require("../modules/auth/auth.controller.js");
const Events = require("../modules/events/event.controller.js");
const Passes = require("../modules/passes/passes.controller.js");
const Teams = require("../modules/teams/team.controller.js");
const Admin = require("../modules/admin/admin.controller.js");
const { checkRole } = require("../shared/middleware/role.middleware.js");
const { influencerValidation } = require("../modules/events/influencer.validation.js");
const { uploadEventImage } = require("../shared/cloudinary.js");
router.get(
  "/api/payment/callback/:merchantOrderId",
  Passes.handlePaymentCallback,
);
router.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  Passes.handlePaymentWebhook,
);
router.post(
  "/payment/webhook",
  express.raw({ type: "application/json" }),
  Passes.handlePaymentWebhook,
);
router.use((req, res, next) => {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' https://www.google-analytics.com https://*.phonepe.com https://dgq88cldibal5.cloudfront.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.phonepe.com https://api-preprod.phonepe.com",
    "frame-src 'self' https://mercury.phonepe.com",
    "worker-src 'self' blob:",
    "form-action 'self'",
  ].join("; ");

  res.setHeader("Content-Security-Policy", csp);

  // Additional security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  next();
});
router.get("/getEvents", Events.getEvents);
router.use("/dashboard", require("../modules/dashboard/dashboard.routes"));

router.get("/getEventById/:id", Events.getEventById);
router.post("/verify", authentication.login);
router.get("/logout", authentication.logout);

router.use(auth.verifyToken);
router.get("/api/ticket-status/:passId", Passes.getTicketStatus);
router.post("/register", influencerValidation, Events.registerForInfluencer);

router.post("/createTeam", Teams.createTeam);
router.post("/joinTeam", Teams.joinTeam);
router.post("/api/book-ticket", Passes.bookTicket);
router.get("/api/passbyuuid/:passUUID", Passes.getPassByUUID);
// Event Interaction Routes
router.get("/likeEvent/:id", Events.likeEvent);
router.get("/unlikeEvent/:id", Events.unlikeEvent);
router.get("/getAllLikedEvents", Events.getAllLikedEvents);

router.post("/bookPass", Passes.bookTicket); // Consider consolidating with /api/book-ticket
router.post("/getPass", Passes.getPassByUserAndEvent);
router.post("/reqEvent", Events.reqEventt);
router.use(checkRole(["admin"]));
router.post("/api/getTix", Passes.getPassByQrStringsAndPassUUID);
router.post("/accept", Passes.Accept);
router.post("/Accept", Passes.Accept);

// Ticket Scanning Routes
router.get("/CanScan", Passes.canScan);
router.get("/regisDetails", Passes.admnDetails);
router.get("/admin/events", Events.getAdminEvents);
router.get("/admin/events/:eventId/stats", Admin.getEventStats);
router.get("/admin/events/:eventId", Events.getAdminEventById);
// router.post("/reject", Passes.Reject);

// Event Management Routes
router.post("/admin/events", Events.addEvent);
router.put("/admin/events/:eventId", Events.updateEvent);
router.post("/admin/event-images", uploadEventImage);
router.post("/addEvent", Events.addEvent);
router.delete("/deleteSpecificEvent/:eventId", Events.deleteSpecificEvent);

module.exports = router;
