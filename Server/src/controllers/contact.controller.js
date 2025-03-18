const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const ContactMessage = require('../models/contactUs.model');

const contactLimiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 10, 
    message: {
        status: 429,
        error: "Too many requests. Please try again in a minute."
    }
});

const validationRules = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
    body('name').trim().notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('message').trim().notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
];

// Contact form handler
exports.contactUs = [
    contactLimiter,
    validationRules,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    status: 'error',
                    errors: errors.array() 
                });
            }

            const { email, name, message } = req.body;

            const contactMessage = await ContactMessage.create({
                name,
                email,
                message,
                ipAddress: req.ip,
                timestamp: new Date()
            });

            // Log the contact request
            console.log(`New contact form submission from ${name} (${email}) at ${new Date().toISOString()}`);

            // Send success response
            return res.status(200).json({
                status: 'success',
                message: 'Your message has been received successfully. We will get back to you soon.'
            });

        } catch (error) {
            // Log the error for debugging
            console.error('Contact form error:', error);

            // Send error response
            return res.status(500).json({
                status: 'error',
                message: 'An error occurred while processing your request. Please try again later.'
            });
        }
    }
];