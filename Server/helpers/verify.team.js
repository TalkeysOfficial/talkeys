const hackTeamModel = require("../models/teams");

exports.verifyTeam = async(teamID,email,phone)=>{
    let team=await hackTeamModel.findById(teamID);
    if(team==null){
        return false;
    }
    else{

        for(let i=0;i<team.members.length;i++){
            console.log(team.members[i].email);
            console.log(email);
            console.log(team.members[i].phone);
            console.log(phone);
            if(team.members[i].email==email && team.members[i].phone==phone){
                return true;
            }
        }
        return false;
    }
}