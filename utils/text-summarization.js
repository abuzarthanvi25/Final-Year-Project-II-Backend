const OpenAI = require("openai");
const openai = new OpenAI({apiKey: process.env.OPENAI_KEY});

const summarizeText = async (course_title, note) => {
    try {
    if(!course_title || !note) return '';

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a course notes summarizer. You get a subject and broken text in terms of notes that has been taken in the class, summarize the content and give the summary of max 5 lines"
            },
            {
                role: "user",
                content: `Subject is ${course_title} and notes are ${note}`
            }
        ]
        ,
        model: "gpt-3.5-turbo",
      });

      return {summary: completion.choices[0].message.content, error: null}
    } catch (error) {
        return {summary: null, error:error.toString()}
    };
}

const handleTransformSummary = (text) => {
    return `<h2>Summary</h2><br/><br/><p>${text}</p>`
}

module.exports = {summarizeText, handleTransformSummary}