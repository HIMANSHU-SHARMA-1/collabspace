//const openAi = require('openai');
const {callAi} = require('./geminiService')
// const client = new openAi({
//     baseURL:'https://integrate.api.nvidia.com/v1',
//     apiKey:process.env.NVIDIA_API_KEY
// });

// const callAi = async(prompt)=>{
//     console.time("AI Request");
//     console.log("Starting AI Call...");
//     const completion = await client.chat.completions.create({
//         model:'deepseek-ai/deepseek-v4-flash',
//         messages:[
//             {
//                 role:"user",
//                 content:prompt
//             }
//         ],
//         temperature:0,
//         max_tokens: 150
//     });
//     console.log("AI Response Received");
//     console.timeEnd("AI Request");
//     return completion.choices[0].message.content;
// }

const testAIConnection = async()=>{
    const prompt = 'Reply with only: AI connection working'
    
    return await callAi(prompt);

};

const getProjectRecommendations = async(userskills, projects)=>{

    const skillText = userskills.map(
        skill => `${skill.name} (${skill.rating}/5)`).join(',');

    const projectText = projects.map(
        project =>`Project Name: ${project.projectname}
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

    Reason must be less than 15 words.

    Return only raw JSON
    Do not use markdown:

    [
        {
            "projectName":"Project Name",
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