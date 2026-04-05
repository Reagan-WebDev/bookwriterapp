require('dotenv').config();

async function run() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("No API key found in .env");
            return;
        }
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        
        if (data.models) {
            data.models.forEach(m => {
                if(m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`Model: ${m.name}`);
                }
            });
        } else {
            console.log("Response:", data);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
