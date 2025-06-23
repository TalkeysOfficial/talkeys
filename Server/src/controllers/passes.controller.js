const asyncHandler = require("express-async-handler");
const TeamSchema = require("../models/teams.model.js");
const express = require("express");
const auth = require("../middleware/oauth.js");
const Event = require("../models/events.model.js");
const Pass = require("../models/passes.model.js");
const User = require("../models/users.model.js");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
// PhonePe Configuration
// 1. ENVIRONMENT CONFIGURATION
const CONFIG = {
    // Make sure you're using the correct URLs for your environment
    PRODUCTION: {
        BASE_URL: '	https://api.phonepe.com/apis/identity-manager',
        AUTH_URL: '	https://api.phonepe.com/apis/identity-manager/v1/oauth/token',
        CHECKOUT_SCRIPT: 'https://mercury.phonepe.com/web/bundle/checkout.js'
    },
    STAGING: {
        BASE_URL: 'https://api-preprod.phonepe.com/apis/pg-sandbox',
        AUTH_URL: 'https://api-preprod.phonepe.com/apis/pg-sandbox/oauth/token',
        CHECKOUT_SCRIPT: 'https://mercury-stg.phonepe.com/web/bundle/checkout.js'
    },
    CLIENT_VERSION: '1.0'
};

// 2. FIXED AUTHENTICATION FUNCTION
const getPhonePeAuthToken = async () => {
    try {
        console.log('Attempting PhonePe authentication...');
        
        const response = await axios.post(CONFIG.STAGING.AUTH_URL, {
            client_id: process.env.PHONEPE_CLIENT_ID,
            client_version: CONFIG.CLIENT_VERSION,
            client_secret: process.env.PHONEPE_CLIENT_SECRET,
            grant_type: 'client_credentials'
        }, {
            headers: {
                'Content-Type': 'application/json', // Changed from form-urlencoded
                'Accept': 'application/json'
            }
        });

        console.log('Auth successful, token received');
        return response.data.access_token;
    } catch (error) {
        console.error('PhonePe auth error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw new Error(`Authentication failed: ${error.response?.data?.message || error.message}`);
    }
};

// 3. CORRECTED ORDER CREATION FUNCTION
const createPhonePeOrder = async (orderData) => {
    try {
        console.log('Creating PhonePe order for:', orderData.merchantOrderId);
        

        console.log("Redirect URL:", `${process.env.BASE_URL}/api/payment/callback/${orderData.merchantOrderId}`);
        console.log("Webhook URL:", `${process.env.BASE_URL}/api/payment/webhook`);


        const accessToken = await getPhonePeAuthToken();
                    console.log("Redirect URL:", `${process.env.BASE_URL}/api/payment/callback/${orderData.merchantOrderId}`);
            console.log("Webhook URL:", `${process.env.BASE_URL}/api/payment/webhook`);
        // Fixed payload structure according to PhonePe API v2
        const paymentPayload = {
            merchantId: process.env.PHONEPE_MERCHANT_ID, // Add this
            merchantOrderId: orderData.merchantOrderId,
            amount: orderData.amount, // amount in paisa
            expireAfter: 1200, // 20 minutes
            mobileNumber: orderData.mobileNumber || "", // Add user's mobile
            // Fixed metaInfo structure
            metaInfo: {
                udf1: orderData.userId,
                udf2: orderData.eventId,
                udf3: orderData.passType || 'General',
                udf4: JSON.stringify(orderData.friends || [])
            },
            

            // Fixed paymentFlow structure
            paymentFlow: {
                type: 'PG_CHECKOUT',
                // Remove message field - not supported in v2
                merchantUrls: {
                    redirectUrl: `${process.env.BASE_URL}/api/payment/callback/${orderData.merchantOrderId}`,
                    webhookUrl: `${process.env.BASE_URL}/api/payment/webhook` // Add webhook URL
                }
            }
        };

        console.log('Payment payload:', JSON.stringify(paymentPayload, null, 2));

        const response = await axios.post(
            `${CONFIG.STAGING.BASE_URL}/checkout/v2/pay`,
            paymentPayload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, // Fixed: removed 'O-'
                    'Accept': 'application/json'
                },
                timeout: 30000 // Add timeout
            }
        );

        console.log('Order created successfully:', response.data);
        return response.data;

    } catch (error) {
        console.error('PhonePe order creation error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw new Error(`Order creation failed: ${error.response?.data?.message || error.message}`);
    }
};

// 4. IMPROVED PAYMENT STATUS CHECK
const checkPaymentStatus = async (merchantOrderId) => {
    try {
        console.log('Checking payment status for:', merchantOrderId);
        
        const accessToken = await getPhonePeAuthToken();
        
        const response = await axios.get(
            `${CONFIG.STAGING.BASE_URL}/checkout/v2/order/${merchantOrderId}/status`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, // Fixed: removed 'O-'
                    'Accept': 'application/json'
                },
                timeout: 15000
            }
        );

        console.log('Payment status response:', response.data);
        return response.data;

    } catch (error) {
        console.error('Payment status check error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw new Error(`Status check failed: ${error.response?.data?.message || error.message}`);
    }
};

// 5. ENHANCED TICKET BOOKING WITH BETTER ERROR HANDLING
const bookTicket = async (req, res) => {
    try {
        console.log('Booking ticket request:', req.body);

        // Validation
        if (!req.body.userId || !req.body.eventId) {
            return res.status(400).json({ 
                success: false,
                error: "User ID and Event ID are required" 
            });
        }

        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found" 
            });
        }

        const event = await Event.findById(req.body.eventId);
        if (!event) {
            return res.status(404).json({ 
                success: false,
                error: "Event not found" 
            });
        }


        const friends = req.body.friends || [];
        const totalTicketsNeeded = 1 + friends.length;
        const totalAmount = event.ticketPrice * totalTicketsNeeded;
        const amountInPaisa = totalAmount * 100;

        // Validation checks...
        if (event.remainingSeats < totalTicketsNeeded) {
            return res.status(400).json({ 
                success: false,
                error: "Insufficient tickets available" 
            });
        }

        // Generate unique merchant order ID with timestamp
        const merchantOrderId = `TKT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        console.log('Generated merchantOrderId:', merchantOrderId);
        

        // Create temporary pass
        const pass = new Pass({
            userId: req.body.userId,
            eventId: req.body.eventId,
            passType: req.body.passType || "General",
            status: "pending",
            merchantOrderId: merchantOrderId,
            amount: totalAmount,
            friends: friends,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 20 * 60 * 1000)
        });

        await pass.save();
        console.log('Pass created with ID:', pass._id);

        // Create PhonePe payment order
        const orderData = {
            merchantOrderId: merchantOrderId,
            amount: amountInPaisa,
            userId: req.body.userId,
            eventId: req.body.eventId,
            eventName: event.title,
            passType: req.body.passType || "General",
            friends: friends,
            mobileNumber: user.phone // Add user's mobile number
        };

        const paymentOrder = await createPhonePeOrder(orderData);

        // Update pass with payment details
        pass.phonePeOrderId = paymentOrder.data?.orderId || paymentOrder.orderId;
        pass.paymentUrl = paymentOrder.data?.redirectUrl || paymentOrder.redirectUrl;
        await pass.save();
        
            console.log("Redirect URL:", `${process.env.BASE_URL}/api/payment/callback/${orderData.merchantOrderId}`);
            console.log("Webhook URL:", `${process.env.BASE_URL}/api/payment/webhook`);
        console.log('Payment order created successfully');

        return res.status(200).json({
            success: true,
            message: "Payment order created successfully",
            data: {
                passId: pass._id,
                merchantOrderId: merchantOrderId,
                phonePeOrderId: paymentOrder.data?.orderId || paymentOrder.orderId,
                amount: totalAmount,
                amountInPaisa: amountInPaisa,
                totalTickets: totalTicketsNeeded,
                paymentUrl: paymentOrder.data?.redirectUrl || paymentOrder.redirectUrl,
                expiresAt: pass.expiresAt,
                event: {
                    id: event._id,
                    title: event.title,
                    date: event.date,
                    venue: event.venue
                },
                friends: friends
            }
        });

    } catch (error) {
        console.error('Ticket booking error:', error);
        return res.status(500).json({ 
            success: false,
            error: "Failed to create payment order",
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};


// Enhanced Payment Callback Handler
const handlePaymentCallback = async (req, res) => {
    try {
        const { merchantOrderId } = req.params;
        console.log('Payment callback received for order:', merchantOrderId);
        
        // Check payment status from PhonePe
        const paymentStatus = await checkPaymentStatus(merchantOrderId);
        console.log('Payment status:', paymentStatus);
        if (paymentStatus.state === 'COMPLETED') {
            const result = await processPaymentConfirmation(merchantOrderId, paymentStatus, 'callback');
            
            if (result.success) {
                return res.redirect(`${process.env.FRONTEND_URL}/ticket/success?passId=${result.passId}&uuid=${result.passUUID}`);
            } else {
                return res.redirect(`${process.env.FRONTEND_URL}/ticket/error?reason=${encodeURIComponent(result.error)}`);
            }
            
        } else if (paymentStatus.state === 'FAILED') {
            const result = await processPaymentFailure(merchantOrderId, paymentStatus, 'callback');
            return res.redirect(`${process.env.FRONTEND_URL}/ticket/failure?passId=${result.passId}`);
            
        } else {
            // Payment still pending
            return res.redirect(`${process.env.FRONTEND_URL}/ticket/pending?orderId=${merchantOrderId}`);
        }

    } catch (error) {
        console.error('Payment callback error:', error);
        return res.redirect(`${process.env.FRONTEND_URL}/ticket/error?reason=callback_error`);
    }
};

// Enhanced Webhook Handler
const handlePaymentWebhook = async (req, res) => {
    try {
        console.log('Webhook received:', req.body);
        
        // Validate webhook signature
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header missing" });
        }

        const signature = authHeader.replace('SHA256 ', '');
        const isValid = validateWebhookSignature(
            process.env.PHONEPE_WEBHOOK_USERNAME,
            process.env.PHONEPE_WEBHOOK_PASSWORD,
            signature
        );

        if (!isValid) {
            console.log('Invalid webhook signature');
            return res.status(401).json({ error: "Invalid signature" });
        }

        const { event, payload } = req.body;
        
        if (event === 'checkout.order.completed') {
            await processPaymentConfirmation(payload.merchantOrderId, payload, 'webhook');
        } else if (event === 'checkout.order.failed') {
            await processPaymentFailure(payload.merchantOrderId, payload, 'webhook');
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Function to get pass details for QR code generation
const getPassForQR = async (req, res) => {
    try {
        const { passUUID } = req.params;
        
        const pass = await Pass.findOne({ 
            passUUID: passUUID,
            status: 'confirmed'
        })
        .populate('userId', 'name email phone')
        .populate('eventId', 'title date venue address');

        if (!pass) {
            return res.status(404).json({ error: "Valid pass not found" });
        }

        return res.json({
            success: true,
            data: {
                passUUID: pass.passUUID,
                passType: pass.passType,
                confirmedAt: pass.confirmedAt,
                user: pass.userId,
                event: pass.eventId,
                friends: pass.friends,
                amount: pass.amount
            }
        });

    } catch (error) {
        console.error('Get pass error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
// Get Ticket Status
const getTicketStatus = async (req, res) => {
    try {
        const { passId } = req.params;
        
        const pass = await Pass.findById(passId)
            .populate('userId', 'name email phone')
            .populate('eventId', 'title date venue location');

        if (!pass) {
            return res.status(404).json({ error: "Pass not found" });
        }

        // If payment is still pending, check status from PhonePe
        if (pass.status === 'pending' && pass.merchantOrderId) {
            try {
                const paymentStatus = await checkPaymentStatus(pass.merchantOrderId);
                
                if (paymentStatus.state === 'COMPLETED') {
                    pass.status = 'confirmed';
                    pass.paymentDetails = paymentStatus.paymentDetails;
                    pass.confirmedAt = new Date();
                    await pass.save();
                } else if (paymentStatus.state === 'FAILED') {
                    pass.status = 'failed';
                    pass.failureReason = paymentStatus.errorCode || 'Payment failed';
                    await pass.save();
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
            }
        }

        return res.status(200).json({
            success: true,
            data: {
                pass: pass,
                qrCode: pass.status === 'confirmed' ? generateQRCode(pass._id) : null
            }
        });

    } catch (error) {
        console.error('Get ticket status error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Generate QR Code for ticket
const generateQRCode = (passId) => {
    // Implement QR code generation logic
    return `${process.env.BASE_URL}/verify-ticket/${passId}`;
};

// Cleanup expired pending passes
const cleanupExpiredPasses = async () => {
    try {
        const expiredPasses = await Pass.find({
            status: 'pending',
            expiresAt: { $lt: new Date() }
        });

        for (const pass of expiredPasses) {
            pass.status = 'expired';
            await pass.save();
        }

        console.log(`Cleaned up ${expiredPasses.length} expired passes`);
    } catch (error) {
        console.error('Cleanup error:', error);
    }
};

// Export functions
module.exports = {
    bookTicket,
    handlePaymentCallback,
    handlePaymentWebhook,
    getTicketStatus,
    checkPaymentStatus,
    cleanupExpiredPasses
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



module.exports = {
    getPassByUserAndEvent,
    bookTicket,
    canScan,
    Accept,
    sendMail,
    Reject,
    handlePaymentCallback,
    handlePaymentWebhook,
    getTicketStatus,
    checkPaymentStatus,
    
     // Also export the email function if you need to use it elsewhere
};