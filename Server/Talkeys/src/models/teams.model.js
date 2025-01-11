const mongoose =  require("mongoose");
const { int } = require("three/examples/jsm/nodes/Nodes.js");
const TeamSchema= new mongoose.schema({
    teamName: {
        type: String,
        required: true,
    },
    TeamCode: {
        type: int,
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
        type: int,
        required
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },

});

