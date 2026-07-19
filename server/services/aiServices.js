//const openAi = require('openai');
const {callAi} = require('./openRouterService')


const testAIConnection = async()=>{
    const prompt = 'Reply with only: AI connection working'
    
    return await callAi(prompt);

};

const getProjectRecommendations = async(userskills, projects)=>{

    const skillText = userskills.map(
        skill => `${skill.name} (${skill.rating}/5)`).join(',');

    const projectText = projects.map(
        project =>`Project Name: ${project.projectname}
        Project ID: ${project._id}
        Required Skill: ${project.requiredSkill.join(',')}
        Description: ${project.description}
        Team Size: ${project.teamsize}
        Current Members: ${project.members.length}`).join('\n')  
        
        
    const prompt = `
    
    You are AI project recommendation engine.
    
    User Skills: ${skillText}

    Available Projects: ${projectText}

    Consider:
    1.Skill Match
    2.Team Capacity
    3.Project Relevance

    Rank projects from best match to worst match.

    Provide a clear, 1-2 sentence explanation for the 'reason' field detailing exactly why the user's skills match the project. Do not make it too brief.

    Return only raw JSON
    Do not use markdown:

    [
        {
            "projectName":"Project Name",
            "projectId":"Project ID",
            "score":95,
            "Team Size":5,
            "Current Members":2,
            "reason":"Reason for recommendation"
        }
    ]
    `;   
    const response = await callAi(prompt);

    const cleanedResponse = response
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
    
try{
    return JSON.parse(cleanedResponse);
}
catch(err){
    console.error('JSON Parse Error:', cleanedResponse)
    return []
}
    }

module.exports = {testAIConnection, getProjectRecommendations}