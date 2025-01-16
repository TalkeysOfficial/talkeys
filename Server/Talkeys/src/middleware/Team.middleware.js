//isTeamOK
const isTeamOK = async (req, res, next) => {
    try {
        const { teamCode } = req.body;
        const team = await Team.findOne({ teamCode });
        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }
        if (team.teamMembers.length >= team.maxMembers) {
            return res.status(400).json({ error: "Team is full" });
        }
        req.team = team;
        next();
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports  = {
    isTeamOK
}
// Compare this snippet from Server/Talkeys/src/controllers/user.controller.js: