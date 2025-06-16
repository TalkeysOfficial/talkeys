// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const { v4: uuidv4 } = require('uuid');

// // User Schema - for login and authentication
// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: function() {
//       return !this.googleId; 
//     },
//     minlength: 6
//   },
//   googleId: {
//     type: String,
//     unique: true,
//     sparse: true 
//   },
//   authProvider: {
//     type: String,
//     enum: ['local', 'google'],
//     default: 'local'
//   },
//   firstName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   phone: {
//     type: String,
//     required: function() {
//       return this.authProvider === 'local';
//     }
//   },
//   profilePicture: {
//     type: String },
//   role: {
//     type: String,
//     enum: ['user', 'organizer', 'admin'],
//     default: 'user'
//   },
//   isVerified: {
//     type: Boolean,
//     default: function() {
//       return this.authProvider === 'google'; 
//     }
//   },
//   emailVerificationToken: String,
//   emailVerificationExpires: Date,
//   resetPasswordToken: String,
//   resetPasswordExpires: Date,
//   lastLoginAt: Date,
//   loginCount: {
//     type: Number,
//     default: 0
//   }
// , 
//   timestamps: true
// });

// userSchema.methods.updateLoginStats = function() {
//   this.lastLoginAt = new Date();
//   this.loginCount += 1;
//   return this.save();
// };

// // Event Schema
// const eventSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   organizer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   venue: {
//     name: String,
//     address: String,
//     city: String,
//     state: String,
//     zipCode: String,
//   },
//   eventDate: {
//     type: Date,
//     required: true
//   },
//   eventEndDate: {
//     type: Date
//   },
//   category: {
//     type: String,
//     required: true,
//     enum: ['concert', 'conference', 'workshop', 'sports', 'theater', 'festival', 'other']
//   },
//   images: [String], // URLs to event images
//   status: {
//     type: String,
//     enum: ['draft', 'published', 'cancelled', 'completed'],
//     default: 'draft'
//   },
//   maxTicketsPerPerson: {
//     type: Number,
//     default: 10,
//     min: 1
//   },
//   ticketSalesStart: {
//     type: Date,
//     required: true
//   },
//   ticketSalesEnd: {
//     type: Date,
//     required: true
//   },
//   totalCapacity: {
//     type: Number,
//     required: true
//   },
//   soldTickets: {
//     type: Number,
//     default: 0
//   }
// }, {
//   timestamps: true
// });

// // Ticket Schema
// const ticketTypeSchema = new mongoose.Schema({
//   event: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Event',
//     required: true
//   },
//   name: {
//     type: String,
//     required: true // e.g., "VIP", "General Admission", "Early Bird"
//   },
//   description: String,
//   price: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1
//   },
//   soldQuantity: {
//     type: Number,
//     default: 0
//   },
//   saleStartDate: Date,
//   saleEndDate: Date,
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   perks: [String]
// }, {
//   timestamps: true
// });

// const couponSchema = new mongoose.Schema({
//   code: {
//     type: String,
//     required: true,
//     unique: true,
//     uppercase: true,
//     trim: true
//   },
//   event: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Event',
//     required: true
//   },
//   organizer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   discountType: {
//     type: String,
//     enum: ['percentage', 'fixed'],
//     required: true
//   },
//   discountValue: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   maxDiscount: {
//     type: Number, // Maximum discount amount for percentage type
//     default: null
//   },
//   usageLimit: {
//     type: Number,
//     default: null
//   },
//   usedCount: {
//     type: Number,
//     default: 0
//   },
//   validFrom: {
//     type: Date,
//     required: true
//   },
//   validUntil: {
//     type: Date,
//     required: true
//   },
//   minPurchaseAmount: {
//     type: Number,
//     default: 0
//   },
//   applicableTicketTypes: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'TicketType'
//   }],  
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });
 
// const attendeeSchema = new mongoose.Schema({
//   ticketId: {
//     type: String,
//     required: true
//   },
//   eventId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Event',
//     required: true
//   },
//   firstName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true,
//     trim: true
//   },
//   phone: {
//     type: String,
//     required: true
//   },
//   dateOfBirth: Date,
//   gender: {
//     type: String,
//     enum: ['male', 'female', 'other', 'prefer_not_to_say']
//   },
  
//   checkInStatus: {
//     type: String,
//     enum: ['pending', 'checked_in', 'no_show'],
//     default: 'pending'
//   },
//   checkInTime: Date,
 
// });
 
// const bookingSchema = new mongoose.Schema({
//   bookingId: {
//     type: String,
//     unique: true,
//     default: () => `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   event: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Event',
//     required: true
//   },
//   ticketDetails: [{
//     ticketType: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'TicketType',
//       required: true
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: 1
//     },
//     pricePerTicket: {
//       type: Number,
//       required: true
//     },
//     subtotal: {
//       type: Number,
//       required: true
//     }
//   }],
//   attendees: [attendeeSchema], // Details of all attendees
//   totalAmount: {
//     type: Number,
//     required: true
//   },
//   discountAmount: {
//     type: Number,
//     default: 0
//   },
//   finalAmount: {
//     type: Number,
//     required: true
//   },
//   couponUsed: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Coupon',
//     default: null
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'completed', 'failed', 'refunded'],
//     default: 'pending'
//   },
//   paymentId: String, // Payment gateway transaction ID
//   paymentMethod: String,
//   bookingStatus: {
//     type: String,
//     enum: ['confirmed', 'cancelled', 'pending'],
//     default: 'pending'
//   },
//   notes: String
// }, {
//   timestamps: true
// });
 
// const ticketSchema = new mongoose.Schema({
//   ticketId: {
//     type: String,
//     unique: true,
//     default: () => `TK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
//   },
//   booking: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Booking',
//     required: true
//   },
//   event: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Event',
//     required: true
//   },
//   ticketType: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'TicketType',
//     required: true
//   },
//   attendee: attendeeSchema, // Individual attendee details for this ticket
//   qrCode: {
//     type: String,
//     unique: true,
//     default: uuidv4
//   },
//   qrCodeUrl: String, // URL to the generated QR code image
//   isScanned: {
//     type: Boolean,
//     default: false
//   },
//   scannedAt: Date,
//   scannedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   scanLocation: String,
//   status: {
//     type: String,
//     enum: ['active', 'used', 'cancelled', 'refunded'],
//     default: 'active'
//   },
//   seatNumber: String, // If assigned seating
//   section: String, // If venue has sections
//   validFrom: Date,
//   validUntil: Date
// }, {
//   timestamps: true
// });

// // Payment Schema - for tracking payments with PhonePe integration
// const paymentSchema = new mongoose.Schema({
//   booking: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Booking',
//     required: true
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   amount: {
//     type: Number,
//     required: true
//   },
//   currency: {
//     type: String,
//     default: 'INR'
//   },

//   merchantTransactionId: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   phonePeTransactionId: {
//     type: String,
//     unique: true,
//     sparse: true
//   },
//   merchantId: String,
//   // General transaction fields
//   transactionId: {
//     type: String,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'initiated', 'completed', 'failed', 'cancelled', 'refunded', 'expired'],
//     default: 'pending'
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['UPI', 'CARD', 'NET_BANKING', 'WALLET', 'BANK_TRANSFER'],
//     default: 'UPI'
//   },
//   // PhonePe response data
//   phonePeResponse: {
//     code: String,
//     message: String,
//     success: Boolean,
//     data: mongoose.Schema.Types.Mixed
//   },
//   // Payment URLs
//   paymentUrl: String, // PhonePe payment URL
//   callbackUrl: String,
//   redirectUrl: String,
//   // Additional metadata
//   failureReason: String,
//   refundAmount: {
//     type: Number,
//     default: 0
//   },
//   refundReason: String,
//   refundTransactionId: String,
//   ipAddress: String,
//   userAgent: String,
//   paymentInitiatedAt: Date,
//   paymentCompletedAt: Date,
//   expiresAt: {
//     type: Date,
//     default: function() {
//       return new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
//     }
//   },
//   metadata: mongoose.Schema.Types.Mixed // Additional payment gateway data
// }, {
//   timestamps: true
// });

// // Index for PhonePe transaction tracking
// paymentSchema.index({ merchantTransactionId: 1 });
// paymentSchema.index({ phonePeTransactionId: 1 });
// paymentSchema.index({ status: 1, expiresAt: 1 });

// // Event Statistics Schema - for organizer analytics
// const eventStatsSchema = new mongoose.Schema({
//   event: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Event',
//     required: true,
//     unique: true
//   },
//   totalTicketsSold: {
//     type: Number,
//     default: 0
//   },
//   totalRevenue: {
//     type: Number,
//     default: 0
//   },
//   totalRefunds: {
//     type: Number,
//     default: 0
//   },
//   salesByTicketType: [{
//     ticketType: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'TicketType'
//     },
//     sold: Number,
//     revenue: Number
//   }],
//   salesByDate: [{
//     date: Date,
//     ticketsSold: Number,
//     revenue: Number
//   }],
//   couponUsage: [{
//     coupon: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Coupon'
//     },
//     timesUsed: Number,
//     discountGiven: Number
//   }],
//   checkedInCount: {
//     type: Number,
//     default: 0
//   },
//   lastUpdated: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });
 
// userSchema.index({ email: 1 });
// eventSchema.index({ organizer: 1, eventDate: 1 });
// ticketTypeSchema.index({ event: 1 });
// couponSchema.index({ code: 1, event: 1 });
// bookingSchema.index({ user: 1, event: 1 });
// ticketSchema.index({ qrCode: 1 });
// ticketSchema.index({ booking: 1 });
// paymentSchema.index({ booking: 1, transactionId: 1 }); 
// module.exports = {
//   User: mongoose.model('User', userSchema),
//   Event: mongoose.model('Event', eventSchema),
//   TicketType: mongoose.model('TicketType', ticketTypeSchema),
//   Coupon: mongoose.model('Coupon', couponSchema),
//   Booking: mongoose.model('Booking', bookingSchema),
//   Ticket: mongoose.model('Ticket', ticketSchema),
//   Payment: mongoose.model('Payment', paymentSchema),
//   EventStats: mongoose.model('EventStats', eventStatsSchema)
// };