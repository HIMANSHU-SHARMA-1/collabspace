const OpenAI = require('openai');

const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY || 'dummy_key_for_testing'
});

const callAi = async (prompt) => {
    try {
        const completion = await client.chat.completions.create({
            model: 'meta-llama/llama-3.3-70b-instruct', // A highly capable, widely available default model on OpenRouter
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.1,
            max_tokens: 500
        });
        
        return completion.choices[0].message.content;
    } catch (err) {
        console.error('OpenRouter Error:', err);
        throw err;
    }
}

module.exports = { callAi };
