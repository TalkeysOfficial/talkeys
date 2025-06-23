const asyncHandler = require("express-async-handler");
const TeamSchema = require("../models/teams.model.js");
const express = require("express");
const auth = require("../middleware/oauth.js");
const Event = require("../models/events.model.js");
const Pass = require("../models/passes.model.js");
const User = require("../models/users.model.js");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');



const bookTicket = async (req, res) => {
    // Validate input
    if (!req.body.teamCode || !req.body.eventId) {
        return res.status(400).json({ error: "Invalid request parameters" });
    }

    const { teamCode, eventId } = req.body;
    const userId = req.user._id;

    try {
        // Find team and populate team members and team leader
        const team = await TeamSchema.findOne({ teamCode: teamCode })
            .populate('teamMembers')
            .populate('teamLeader');

        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        // Check if teamLeader is populated and is a valid ObjectId
        if (!team.teamLeader || !mongoose.Types.ObjectId.isValid(team.teamLeader._id)) {
            return res.status(404).json({ error: "Team leader not found or invalid" });
        }
        console.log("===================")
        console.log(team)

        // Check if the user is the team leader
        // if (userId != team.teamLeader) {
        //     return res.status(403).json({ error: "Only team leader can book tickets" });
        // }

        // Find event
        const event = await Event.findOne({
            _id: eventId,
            isLive: true,
        });

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        console.log("Debug: Event found")
        // Check ticket availability
        if (event.totalSeats < 0) {
            return res.status(400).json({ error: "Insufficient tickets available" });
        }

        // Check if any team member already has a pass
        const existingPasses = await Pass.find({
            userId,
            eventId: event._id,
        });

        if (existingPasses.length > 0) {
            return res.status(400).json({
                error: "Some team members already have passes for this event",
            });
        }
        // Create pass for entire team
        const teamPasses = team.teamMembers.map((member) => ({
            userId: member._id,
            eventId: event._id,
            passType: "General",
        }));
        
        await Promise.all(teamPasses.map(pass => Pass.create(pass)));
        console.log("fuck!!!")

        // Update event tickets
        const updatedEvent = await Event.findByIdAndUpdate(
            event._id,
            {
                $inc: { totalSeats: -team.teamMembers.length },
            },
            { new: true },
        );

        return res.status(200).json({
            message: "Team tickets booked successfully",
            teamMembers: team.teamMembers.length,
            remainingTickets: updatedEvent.totalSeats,
        });
    } catch (error) {
        console.error("Ticket booking error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getPassByUserAndEvent = async (req, res) => {
    try {
        const pass = await Pass.findOne({ 
            userId: req.user._id, 
            eventId: req.body.eventId 
        }, '_id');
        if (!pass) {
            return res.status(404).json({ error: "Pass not found" });
        }

        return res.status(200).json(pass);
    } catch (error) {
        console.error('Get pass error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const getPlayerByPassId= async (req, res) => {
    var passId= req.body.passId;
    try {
        // passId = mongoose.Types.ObjectId(passId);
        const pass = await Pass.findById(req.body.passId);
        console.log(pass)
        if (!pass) {
            return res.status(404).json({ error: "Pass not found" });
        }
        console.log("fuck i am here",passId)
        const user = await User.findById(pass.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const { name, email, phoneNumber } = user;
        
        return res.status(200).json({ name, email, phoneNumber });
    } catch (error) {
        console.error('Get pass error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const Accept= async(req, res) => {
    const passId= req.body.passId;
    try {
        const pass = await Pass.findById(passId);
        if (!pass) {
            return res.status(404).json({ error: "Pass not found" });
        }
        pass.isScanned = true;
        await pass.save();
        return res.status(200).json({ message: "Pass scanned successfully" });
    }
    catch (error) {
        console.error('Get pass error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const Reject = async(req,res) => {
    const passId= req.body.passId;
    try {
        const pass = await Pass.findById(passId);
        if (!pass) {
            return res.status(404).json({ error: "Pass not found" });
        }
        pass.isScanned = false;
        await pass.save();
        return res.status(200).json({ message: "Pass rejected successfully" });
    }
    catch (error) {
        console.error('Get pass error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const canScan = async(req, res) => {
    const user = req.user;
    try {
        if (user.role !== 'admin') {
            return res.status(403).json({ error: "Forbidden: Invalid role" });
        }
        return res.status(200).json({ message: "User can scan passes" });

}
    catch (error) {
        console.error('Get pass error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const Registration = require('../models/registration.model.js'); 
const sendMail = async (options) => {
try {
    // Extract email parameters from options
    const { to, subject, html, teamName, registrationId } = options;
    
    // Create email content based on whether it's a confirmation email or custom email
    let emailContent = html;
    
    // If teamName is provided, assume it's a confirmation email
    if (teamName) {
    emailContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registration Confirmation</title>
        </head>
        <body>
            <p><strong>Dear ${teamName},</strong></p>
            <p>
            Thank you for registering for <strong>Startup Ignite</strong> via Talkeys!
            We're excited to have you onboard for this experience. Your registration has been successfully recorded.
            </p>
            <h3>What's Next?</h3>
            <ul>
            <li>Stay tuned for further updates and important announcements regarding the event.</li>
            <li>
                All relevant details, guidelines, or competition briefs will be shared with you soon via email or on the official Talkeys platform.
            </li>
            <li>
                If you have any questions, feel free to contact us at <a href="mailto:talkeys11@gmail.com">talkeys11@gmail.com</a>
            </li>
            </ul>
            <p>We look forward to seeing you participate and make the most of this event! 🚀</p>
            <p>
            Best regards,<br>
            Team Talkeys<br>
            <a href="http://www.talkeys.xyz">www.talkeys.xyz</a>
            </p>
        </body>
        </html>
    `;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
    });

    // Mail options
    const mailOptions = {
    from: `"Talkeys" <${process.env.EMAIL_USER}>`,
    to,
    subject: subject || "Talkeys Notification",
    html: emailContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
} catch (error) {
    console.error('Error sending email:', error);
    throw error;
}
};




const register = async (req, res) => {
    console.log("register")
    try {
    const {
        teamName,
        domain,
        members,
        projectTitle,
        projectDescription,
        contactEmail,
        contactPhone
    } = req.body;
    console.log(req.body)

    if (!teamName || !domain || !members || !projectTitle || !projectDescription || !contactEmail) {
    return res.status(400).json({ 
        success: false, 
        message: "Missing required fields" 
    });
    }

    const validDomains = ['Agritech', 'Edtech', 'Healthtech', 'Fintech', 'E-commerce', 'AI/ML', 'Cybersecurity', 'Open Domain'];
if (!validDomains.includes(domain)) {
    return res.status(400).json({ 
    success: false, 
    message: "Invalid domain selection" 
    });
}

if (!Array.isArray(members) || members.length < 2 || members.length > 5) {
    return res.status(400).json({ 
    success: false, 
    message: "Team must have at least 2 members and at most 5 members" 
    });
}
for (const member of members) {
    if (!member.name || !member.email || !member.college) {
    return res.status(400).json({ 
        success: false, 
        message: "Incomplete member information" 
    });
    }
}

const newRegistration = {
    teamName,
    domain,
    members,
    projectTitle,
    projectDescription,
    contactEmail,
    contactPhone,
    proposalSubmitted: false,
    registrationDate: new Date(),
    status: 'Pending'
};

const registration = await Registration.create(newRegistration);

    // Send confirmation email using the unified function
await sendMail({
    to: contactEmail,
    subject: "Team Registration Confirmation",
    teamName: teamName,
    registrationId: registration._id
});

return res.status(201).json({
    success: true,
    message: "Team registered successfully",
    registrationId: registration._id
});
} catch (error) {
console.error("Registration error:", error);
return res.status(500).json({
    success: false,
    message: "Failed to register team",
    error: error.message
});
}
};

module.exports = {
    getPassByUserAndEvent,
    bookTicket,
    getPlayerByPassId,
    canScan,
    Accept,
    sendMail,
    Reject,
    register, // Also export the email function if you need to use it elsewhere
};