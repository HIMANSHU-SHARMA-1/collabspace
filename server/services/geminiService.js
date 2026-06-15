const {googleGenerativeAi, GoogleGenerativeAI} = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model =   genAI.getGenerativeModel({
    model:'gemini-2.5-flash'
})

const callAi = async(prompt)=>{
    try{
        // console.time('Gemini request')
        const result = await model.generateContent(prompt);
        // console.timeEnd('Gemini request')
        return result.response.text()
    }
    catch(err){
        console.error('Gemini Error:',err)
        throw err;
    }
}
module.exports = {callAi}