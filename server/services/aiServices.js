const openAi = require('openai');

const client = new openAi({
    baseURL:'https://integrate.api.nvidia.com/v1',
    apiKey:process.env.NVIDIA_API_KEY
});

const callAi = async(prompt)=>{
    console.time("AI Request");
    const completion = await client.chat.completions.create({
        model:'deepseek-ai/deepseek-v4-flash',
        messages:[
            {
                role:"user",
                content:prompt
            }
        ],
        temperature:0,
        max_tokens: 500
    });
    console.timeEnd("AI Request");
    return completion.choices[0].message.content;
}

const testAIConnection = async()=>{
    const prompt = 'Reply with only: AI connection working'
    
    return await callAi(prompt);

};

const getProjectRecommendations = async(userskills, projects)=>{

    const skillText = userskills.map(
        skills => `${skills.name} (${skills.rating}/5)`).join(',');

    const projectText = projects.map(
        project =>`Project Name: ${project.projectname}
        Required Skill: ${project.requiredSkill.join(',')}
        Description: ${project.description}`).join('\n')  
        
        
    const prompt = `You are AI project recommendation engine.
    
    User Skills: ${skillText}

    Available Projects: ${projectText}

    Rank projects from best match to worst match.

    Return only valid json in this format:

    [
        {
            "projectName":"Project Name",
            "score":95,
            "reason":"Reason for recommendation"
        }
    ]
    `;   
//     console.log(prompt);
// console.log(prompt.length);
     const response = await callAi(prompt);   
     return JSON.parse(response);
}

module.exports = {testAIConnection, getProjectRecommendations}