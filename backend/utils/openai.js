import 'dotenv/config';

const getOpenAIAPIResponse = async(message)=>{
     const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const prompt = message;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt  }]
                    }
                ]
            })
        };
    
        try {
            const response = await fetch(endpoint, options);
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (err) {
            console.error("Error:", err);
            res.status(500).json({ error: "An error occurred" });
        }
}

export default getOpenAIAPIResponse;