/**
 * Serverless Function (Vercel) para recomendação de estágios.
 * Baseada na implementação robusta do projeto 'anhangueracxs-chatbot'.
 * Usa fetch nativo para evitar dependências de bibliotecas externas.
 */
export default async function handler(req, res) {
    // 1. Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 2. Validar Método
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido. Use POST.' });
    }

    // 3. Obter Chave de API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("ERRO: GEMINI_API_KEY não configurada.");
        return res.status(500).json({ error: 'Configuração do servidor incompleta.' });
    }

    try {
        // 4. Extrair dados do Body
        const { state } = req.body;
        if (!state || !state.Estado) {
            return res.status(400).json({ error: 'Dados do estado inválidos.' });
        }

        // 5. Construir o Prompt (Lógica de Negócio)
        const salarioTexto = (state['Salário Mínimo por Hora (USD)'] !== 'N/C' && state['Salário Mínimo por Hora (USD)'] > 0) 
            ? `$${Number(state['Salário Mínimo por Hora (USD)']).toFixed(2)}/hora`
            : 'Não aplicável';

        const systemInstruction = `Você é um mentor de carreira especializado em intercâmbio nos EUA. Responda em Português do Brasil usando Markdown.`;
        
        const userPrompt = `
        Analise o estado: ${state.Estado} (${state['Sigla do Estado']}).
        Dados:
        - Destaque: ${state['Destaque Principal']}
        - Custo de Vida: ${state['Índice de Custo de Vida']}
        - Salário: ${salarioTexto}
        - Acadêmico: ${state['Ambiente Acadêmico (Geral)']}
        - Clima: ${state['Clima (Geral)']}

        Gere um resumo com:
        ## Prós
        * (2-3 pontos positivos)
        ## Contras
        * (2-3 pontos de atenção)
        ## Oportunidades
        * (3-4 empresas/indústrias chave)
        `;

        // 6. Chamada Direta à API do Google (Igual ao projeto do chatbot)
        // Usando gemini-1.5-flash que é o modelo estável padrão para texto rápido
        const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] }
        };

        const googleResponse = await fetch(googleApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await googleResponse.json();

        if (!googleResponse.ok) {
            console.error('Erro da API Google:', data);
            return res.status(googleResponse.status).json({ 
                error: 'Erro na IA', 
                details: data.error?.message || 'Erro desconhecido' 
            });
        }

        // 7. Extrair texto da resposta
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta.";

        res.status(200).json({ analysis: text });

    } catch (error) {
        console.error('Erro interno:', error);
        res.status(500).json({ error: 'Erro interno ao processar solicitação.' });
    }
}