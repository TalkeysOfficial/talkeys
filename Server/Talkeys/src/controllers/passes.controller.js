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
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>New Message</title> <!--[if (mso 16)]><style type="text/css"> a {text-decoration: none;}  </style><![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]><noscript> <xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> </noscript>
<![endif]--><!--[if mso]><xml> <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"> <w:DontUseAdvancedTypographyReadingMail/> </w:WordDocument> </xml>
<![endif]--><style type="text/css">.rollover:hover .rollover-first { max-height:0px!important; display:none!important;}.rollover:hover .rollover-second { max-height:none!important; display:block!important;}.rollover span { font-size:0px;}u + .body img ~ div div { display:none;}#outlook a { padding:0;}span.MsoHyperlink,span.MsoHyperlinkFollowed { color:inherit; mso-style-priority:99;}a.es-button { mso-style-priority:100!important; text-decoration:none!important;}a[x-apple-data-detectors],#MessageViewBody a { color:inherit!important; text-decoration:none!important; font-size:inherit!important; font-family:inherit!important; font-weight:inherit!important; line-height:inherit!important;}.es-desk-hidden { display:none; float:left; overflow:hidden; width:0; max-height:0; line-height:0; mso-hide:all;}@media only screen and (max-width:600px) {.es-m-p20b { padding-bottom:20px!important } .es-p-default { }
 *[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } .es-header-body p { } .es-content-body p { } .es-footer-body p { } .es-infoblock p { } h1 { font-size:40px!important; text-align:left } h2 { font-size:32px!important; text-align:left } h3 { font-size:28px!important; text-align:left } h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:40px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:32px!important }
 .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:28px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important }
 .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important } .es-m-txt-r .rollover span, .es-m-txt-c .rollover span, .es-m-txt-l .rollover span { line-height:0!important; font-size:0!important; display:block } .es-spacer { display:inline-table }
 a.es-button, button.es-button { font-size:14px!important; padding:10px 20px 10px 20px!important; line-height:120%!important } a.es-button, button.es-button, .es-button-border { display:inline-block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important }
 table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .h-auto { height:auto!important } }@media screen and (max-width:384px) {.mail-message-content { width:414px!important } }</style>
 </head> <body class="body" style="width:100%;height:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"><div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#F6F6F6"><!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#f6f6f6"></v:fill> </v:background><![endif]--><table width="100%" cellspacing="0" cellpadding="0" class="es-wrapper" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-color:#F6F6F6"><tr><td valign="top" style="padding:0;Margin:0"><table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important"><tr>
<td align="center" style="padding:0;Margin:0"><table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"><tr><td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px"><table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td valign="top" align="center" style="padding:0;Margin:0;width:560px"><table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
<td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Dear ${teamName},</strong></p> <p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Thank you for registering for <strong> Startup Ignite </strong> via Talkeys! We’re excited to have you onboard for this experience. Your registration has been successfully recorded.</p></td></tr></table></td></tr></table></td></tr> <tr><td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px"><table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr>
<td align="left" style="padding:0;Margin:0;width:560px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0"><h3 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:28px;font-style:normal;font-weight:normal;line-height:33.6px;color:#333333"><strong>What’s Next?</strong></h3><ul style="font-family:arial, 'helvetica neue', helvetica, sans-serif;padding:0px 0px 0px 40px;margin-top:15px;margin-bottom:15px"> <li style="color:#333333;margin:0px 0px 15px;font-size:14px">Stay tuned for further updates and important announcements regarding the event.</li> 
<li style="color:#333333;margin:0px 0px 15px;font-size:14px">All relevant details, guidelines, or competition briefs will be shared with you soon via email or on the official Talkeys platform.</li> <li style="color:#333333;margin:0px 0px 15px;font-size:14px">If you have any questions, feel free to contact us at <em><u style="color:#0b5394">talkeys11@gmail.com</u></em></li> </ul><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">We look forward to seeing you participate and make the most of this event! 🚀</p></td></tr></table></td></tr></table></td></tr></table></td></tr></table> <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important"><tr>
<td align="center" bgcolor="transparent" style="padding:0;Margin:0"><table cellspacing="0" bgcolor="#ffffff" align="center" cellpadding="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"><tr><td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px"><!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:366px" valign="top"><![endif]--><table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left"><tr>
<td align="left" class="es-m-p20b" style="padding:0;Margin:0;width:366px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px"><strong>Best regards,</strong><br> Team Talkeys<br> <a href="http://www.talkeys.xyz" target="_new" style="mso-line-height-rule:exactly;text-decoration:underline;color:#1376C8;font-size:14px">www.talkeys.xyz</a></p> </td></tr></table></td></tr></table> <!--[if mso]></td><td style="width:20px"></td>
<td style="width:174px" valign="top"><![endif]--><table align="right" cellpadding="0" cellspacing="0" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right"><tr><td align="left" style="padding:0;Margin:0;width:174px"><table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"><tr><td align="center" style="padding:0;Margin:0;font-size:0"><a target="_blank" href="https://talkeys.xyz" style="mso-line-height-rule:exactly;text-decoration:underline;color:#1376C8;font-size:14px"><img src="https://ekrenck.stripocdn.email/content/guids/CABINET_8ac9a0af34436c0bcdd203f71e9371d5c324b0013be7eddc4051055eae518da2/images/image.png" alt="" width="74" class="adapt-img" height="66" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></a> </td>
</tr></table></td></tr></table><!--[if mso]></td></tr></table><![endif]--></td></tr></table></td></tr></table><table align="center" cellspacing="0" cellpadding="0" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important"></table><table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important"></table></td></tr></table></div></body></html>
    `;
    await sendeMail(email, subject, message);
}
const nodemailer = require('nodemailer');

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