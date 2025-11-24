import { GoogleGenAI } from "@google/genai";

// A chave de API é lida de forma segura da variável de ambiente no Vercel.
// O Vercel a injeta via "process.env.GEMINI_API_KEY"
const geminiApiKey = process.env.GEMINI_API_KEY;

// Inicializa o cliente Gemini com a chave segura
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

/**
 * Helper para construir o prompt (similar ao que estava no frontend).
 */
function buildPrompt(stateData) {
    // Recalcula o salário mínimo para o prompt
    const salarioMinimo = (stateData['Salário Mínimo por Hora (USD)'] !== 'N/C' && stateData['Salário Mínimo por Hora (USD)'] > 0) 
        ? `$${Number(stateData['Salário Mínimo por Hora (USD)']).toFixed(2)}/hora`
        : 'Não aplicável';

    const systemPrompt = `Você é um assistente de carreira e mentor para estudantes que procuram estágios nos EUA.
Seja conciso, útil e use um tom encorajador.
Formate sua resposta obrigatoriamente usando Markdown simples (títulos com ##, listas com *).
Responda sempre em Português do Brasil.`;
            
    const userQuery = `Estou a analisar o estado ${stateData.Estado} (${stateData['Sigla do Estado']}).
    Tenho os seguintes dados:
    - Destaque Principal: ${stateData['Destaque Principal']}
    - Custo de Vida (Índice): ${stateData['Índice de Custo de Vida']}
    - Salário Mínimo: ${salarioMinimo}
    - Ambiente Acadêmico: ${stateData['Ambiente Acadêmico (Geral)']}
    - Clima: ${stateData['Clima (Geral)']}

    Por favor, gera um resumo para um estudante (potencialmente internacional) sobre estagiar aqui.
    O resumo deve incluir:
    ## Prós
    * (Liste 2-3 prós, considerando os dados)
    ## Contras
    * (Liste 2-3 contras, considerando os dados)
    ## Oportunidades
    * (Liste 3-4 empresas ou indústrias chave para estágios, com base no "Destaque Principal")
    `;

    return { systemPrompt, userQuery };
}

/**
 * Função principal que o Vercel executa.
 * Reage a requisições HTTP (POST do seu frontend).
 */
export default async function handler(req, res) {
    // 1. Validar Método
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido. Use POST.' });
    }

    // 2. Validar Chave de API
    if (!geminiApiKey) {
        console.error("GEMINI_API_KEY não configurada.");
        return res.status(500).json({ error: 'Chave de API do Gemini não configurada no servidor.' });
    }

    // 3. Extrair dados do estado
    let stateData;
    try {
        const body = req.body;
        stateData = body.state;
        if (!stateData || !stateData.Estado) {
            return res.status(400).json({ error: 'Dados do estado inválidos ou ausentes.' });
        }
    } catch (e) {
        return res.status(400).json({ error: 'Formato da requisição inválido.' });
    }

    // 4. Construir o Prompt
    const { systemPrompt, userQuery } = buildPrompt(stateData);

    // 5. Chamar a API do Gemini
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Usa o mesmo modelo que estava no frontend
            contents: [{ role: "user", parts: [{ text: userQuery }] }],
            config: {
                systemInstruction: systemPrompt,
            },
        });

        const text = response.text;

        // 6. Retornar a resposta (apenas o texto)
        res.status(200).json({ analysis: text });

    } catch (error) {
        console.error('Erro na API Gemini:', error);
        res.status(500).json({ error: 'Erro ao processar a análise da IA.' });
    }
}