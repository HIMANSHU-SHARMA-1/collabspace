import openAiPkg =   require('openai')
import skills = require('openai/resources/skills.js');
const { OpenAI } = openAiPkg
const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY || 'dummy_key_for_testing'
});

const callAi = async (prompt:string) => {
    try {
        const completion = await client.chat.completions.create({
            model: 'meta-llama/llama-3.3-70b-instruct', // A highly capable, widely available default model on OpenRouter
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 500
        });

        const choice = completion.choices[0]
        if(!choice){
            throw new Error('No response from AI')
        }

        const content = choice.message.content
        if(!content){
            throw new Error('AI return empty content')
        }
        return content
   
    } catch (err) {
        console.error('OpenRouter Error:', err);
        throw err;
    }
}

export = { callAi };
