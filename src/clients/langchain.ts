import { OpenAI } from "@langchain/openai"

const llm = new OpenAI({
    model: "gpt-3.5-turbo-instruct",
    temperature: 0,
    maxTokens: undefined,
    timeout: undefined,
    maxRetries: 2,
    apiKey: process.env.OPENAI_API_KEY,
    // other params...
})

export default llm
