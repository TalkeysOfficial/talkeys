const mongoose =  require("mongoose");
const TeamSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    teamLeader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teamCode: { 
        type: String, 
        required: true, 
        default: () => Math.random().toString(36).substring(2, 8).toUpperCase() 
    },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    maxMembers: { 
        type: Number, 
        required: true, 
        default: 2  // Set a default max members value
    }
});
const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
