export default async function handler(req, res) {
    // 1. Segurança: Aceita apenas método POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Pegar a chave das Variáveis de Ambiente da Vercel
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key not configured on server' });
    }

    // 3. Pegar o prompt enviado pelo frontend
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // 4. Chamar a API do Google (lado do servidor)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // 5. Retornar a resposta para o seu site
        if (!response.ok) {
            throw new Error(data.error?.message || 'Error fetching from Google');
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        res.status(200).json({ text });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: 'Error processing AI request' });
    }
}