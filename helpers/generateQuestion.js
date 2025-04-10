const { GoogleGenAI } = require("@google/genai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generateQuestion(topic) {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `
                berikan saya 5 pertanyaan dan jawaban yang benar tentang ${topic}
                tampilkan dalam format json sesuai dengan format dibawah ini
                [
                    {
                        "question": "pertanyaan",
                        "listAnswer": ["jawaban1", "jawaban2", "jawaban3", "jawaban4"],
                        "correctAnswer": "jawaban yang benar",
                        "score": skor pertanyaan (integer)
                    }
                ]

                hanya tampilkan data json itu saja tanpa ada data yang lain
            `,
        });

        return response.text.replace("```json", "").replace("```", "")
    } catch (error) {
        console.log(error);
    }

}

module.exports = generateQuestion