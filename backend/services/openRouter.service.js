import axios from "axios"

export const askAi = async (messages) => {
    try {
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error("Messages array is empty ");
        }
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "openai/gpt-4o-mini",
            messages: messages
        },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API}`,
                    'Content-Type':'application/json',
                },
            });

            const content = response?.data?.choices?.[0]?.message?.content ?? response?.data?.choice?.[0]?.message?.content;
            if (!content || !content.trim()) {
                throw new Error(`AI returned empty response: ${JSON.stringify(response?.data)}`);
            }
            return content;
    } catch (error) {
        const details = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        console.error("OpenRouter.Error:", details);
        throw new Error(`Openrouter api error: ${details}`);

    }

}