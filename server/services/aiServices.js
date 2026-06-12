const openAi = require('openai')

const client = new openAi({
    baseURL:'https://integrate.api.nvidia.com/v1',
    apiKey:process.env.NVIDIA_API_KEY
});

const testAIConnection = async()=>{
    const completion = await client.chat.completions.create({
        model:'deepseek-ai/deepseek-v4-flash',
        messages: [
            {
                role:"user",
                "content":"Reply with only: AI connection working"}
        ],
        temperature:0
    });
    return completion.choices[0].message.content;

};
module.exports = {testAIConnection}