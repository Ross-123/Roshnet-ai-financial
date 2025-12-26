import { Inngest } from "inngest";

export const inngest = new Inngest({
    id: 'Roshnet-ai-financial',
    ai: { gemini: { apiKey: process.env.GEMINI_API_KEY! } }
})
