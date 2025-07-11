const express = require("express");
const router = express.Router();

const auth = require("../middleware/oauth.js");
const { checkRole } = require("../middleware/role.middleware.js");
const { isTeamOK } = require("../middleware/Team.middleware.js");

const authentication = require("../controllers/authentication.js");
const Events = require("../controllers/event.controller.js");
const Passes = require("../controllers/passes.controller.js");
const Team = require("../controllers/team.controller.js");
const contact = require("../controllers/contact.controller.js");
const Community = require("../controllers/community.controller.js");
const Group = require("../controllers/group.controller.js");
const Post = require("../controllers/post.controller.js");
const Comment = require("../controllers/comment.controller.js");
const Message = require("../controllers/message.controller.js");
const DM = require("../controllers/dm.controller.js");

// ---------- Security Headers Middleware ----------
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
        "form-action 'self'"
    ].join("; ");

    res.setHeader('Content-Security-Policy', csp);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// ---------- Public Routes ----------
router.post("/verify", authentication.login);
router.get("/logout", authentication.logout);
router.get("/getEvents", Events.getEvents);
router.get("/getEventById/:id", Events.getEventById);
router.post("/register", Passes.register);

router.get('/api/ticket-status/:passId', Passes.getTicketStatus);
router.get('/api/payment/callback/:merchantOrderId', Passes.handlePaymentCallback);
router.post('/api/book-ticket', Passes.bookTicket);
router.post('/payment/webhook', express.raw({ type: 'application/json' }), Passes.handlePaymentWebhook);

// Routes after authentication
router.use(auth.verifyToken);

// Ticket & Pass routes
router.get('/api/passbyuuid/:passUUID', Passes.getPassByUUID);
router.post("/bookPass", Passes.bookTicket); // Consider unifying with /api/book-ticket
router.post("/getPass", Passes.getPassByUserAndEvent);

// Event Interaction
router.get("/likeEvent/:id", Events.likeEvent);
router.get("/unlikeEvent/:id", Events.unlikeEvent);
router.get("/getAllLikedEvents", Events.getAllLikedEvents);
router.post("/reqEvent", Events.reqEventt);

// Team Routes
router.post("/joinTeam", Team.joinTeam);
router.post("/createTeam", Team.createTeam);
router.post("/getTeam", Team.getTeam);

// Contact
router.post("/contactUs", contact.contactUs);

// Community Routes
router.get("/communities", Community.getAllCommunities);
router.post("/communities", Community.createCommunity);
router.get("/communities/joined", Community.getJoinedCommunities);
router.get("/communities/:slug", Community.getCommunityBySlug);
router.post("/communities/:communityId/join", Community.joinCommunity);
router.post("/communities/:communityId/leave", Community.leaveCommunity);

// Group Messaging
router.get("/groups/:communityId", Group.getGroupsByCommunity);
router.post("/groups", Group.createGroup);
router.get("/groups/messages/:id", Group.getGroupMessages);
router.post("/groups/:id/messages", Group.sendMessage);

// General Messaging
router.get("/messages/group/:groupId", Message.getMessagesByGroup);
router.get("/messages/community/:communityId", Message.getMessagesByCommunity);
router.post("/messages", Message.sendMessage);
router.delete("/messages/:messageId", Message.deleteMessage);

// Posts
router.post("/posts", Post.createPost);
router.get("/posts/:communityId", Post.getPostsByCommunity);
router.get("/posts/details/:id", Post.getPostById);
router.post("/posts/:postId/like", Post.likePost);
router.post("/posts/:postId/unlike", Post.unlikePost);
router.post("/posts/:postId/comment", Post.commentOnPost);
router.get("/posts/:postId/delete", Post.deletePost);

// Comments
router.get("/comments/:postId", Comment.getCommentsByPost);
router.post("/comments/:postId", Comment.addComment);
router.post("/comments/:commentId/vote", Comment.voteComment);
router.delete("/comments/:commentId", Comment.deleteComment);

// DM Routes
router.post("/dm", DM.sendDM);
router.get("/dm/conversations", DM.getDMConversations);
router.get("/dm/:userId", DM.getDMHistory);

// ---------- Admin Routes ----------
router.use(checkRole(["admin"]));

// Ticket Scanning & Payment
router.get("/CanScan", Passes.canScan);
router.post("/verifyPass", Passes.getPlayerByPassId);
router.post("/reject", Passes.Reject);
router.post("/accept", Passes.Accept);
router.post("/payment/:bookingId", Passes.initiatePayment);
router.post("/payment/verify", Passes.verifyPayment);
router.post("/payment/result", Passes.getPaymentResult);

// Admin Event Management
router.post("/addEvent", Events.addEvent);
router.delete("/deleteSpecificEvent/:eventId", Events.deleteSpecificEvent);

// Dashboard routes
router.use("/dashboard", require("./dashboard.routes"));

module.exports = router;
