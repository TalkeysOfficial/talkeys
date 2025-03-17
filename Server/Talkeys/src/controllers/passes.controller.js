const asyncHandler = require("express-async-handler");
const TeamSchema = require("../models/teams.model.js");
const express = require("express");
const auth = require("../middleware/oauth.js");
const Event = require("../models/events.model.js");
const Pass = require("../models/passes.model.js");
const User = require("../models/users.model.js");
const mongoose = require("mongoose");



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
const sendeMail = async (to, subject, htmlContent) => {
    try {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: `"Ideathon Registration" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
    } catch (error) {
    console.error('Error sending email:', error);
    throw error;
    }
};
const register = async(req, res) => {
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
        await sendConfirmationEmail(contactEmail, teamName, registration._id);

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
sendConfirmationEmail = async (email, teamName, registrationId) => {
    const subject = "Team Registration Confirmation";
    const message = `
        <p>Hi,</p>
        <p>Your team <strong>${teamName}</strong> has been successfully registered for the event.</p>
        <p>Registration ID: <strong>${registrationId}</strong></p>
        <p>Thank you for registering!</p>
    `;
    await sendeMail(email, subject, message);
}
const nodemailer = require('nodemailer');
const sendMail = async (to, subject, htmlContent) => {
    try {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: `"Ideathon Registration" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
    } catch (error) {
    console.error('Error sending email:', error);
    throw error;
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
    register
};