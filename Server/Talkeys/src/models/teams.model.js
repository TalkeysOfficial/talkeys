const mongoose =  require("mongoose");
const TeamSchema= new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
    },
    TeamCode: {
        type: Number,
        required: true,
    },
    teamMembers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        required: true,
    },
    teamLeader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    MaxMembers: {
        type: Number,
        required:true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

