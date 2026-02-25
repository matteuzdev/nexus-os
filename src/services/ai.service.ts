import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    // Para produção do Nexus, isso idealmente vem de um backend seguro ou config de usuário (Local Storage)
    // Deixaremos mockado o fallback caso a API não esteja preenchida
    const apiKey = localStorage.getItem('NEXUS_GEMINI_KEY');
    if (apiKey) {
      this.configure(apiKey);
    }
  }

  configure(apiKey: string) {
    try {
      this.ai = new GoogleGenAI({ apiKey });
      localStorage.setItem('NEXUS_GEMINI_KEY', apiKey);
    } catch (e) {
      console.error('Erro ao configurar Gemini AI:', e);
    }
  }

  hasKey(): boolean {
    return !!this.ai;
  }

  /**
   * AI-02: Support Intelligence
   * Analisa um ticket e sugere prioridade e resumo técnico.
   */
  async analyzeTicket(description: string): Promise<{ priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica', summary: string }> {
    if (!this.ai) {
      return { 
        priority: 'Média', 
        summary: 'IA Offline. Insira a API Key para análise automática.' 
      };
    }

    try {
      const prompt = `Analise o seguinte ticket de suporte de um cliente de tecnologia (Agência Konig Systems).
Retorne APENAS um JSON (sem crases Markdown) com duas propriedades:
"priority": Uma string exata dentre "Baixa", "Média", "Alta" ou "Crítica". Baseie-se na urgência (sistemas caídos = Crítica, dúvidas = Baixa).
"summary": Resumo técnico do problema em até 15 palavras.

Descrição do Ticket:
"${description}"`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '{}';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.error('AI Error:', err);
      return { priority: 'Alta', summary: 'Falha na análise da IA.' };
    }
  }

  /**
   * AI-03: Dev Autogen
   * Quebra um requisito de negócio ou ticket em tarefas técnicas de Kanban.
   */
  async generateTechnicalTasks(context: string): Promise<{ title: string, type: 'Feature' | 'Bug' | 'Automação' | 'Melhoria', points: number }[]> {
    if (!this.ai) return [];

    try {
       const prompt = `Como um Arquiteto de Software Sênior, quebre a seguinte demanda em 1 a 3 tarefas técnicas de desenvolvimento (Kanban).
Retorne APENAS um Array JSON (sem crases Markdown) onde cada objeto tem:
"title": Nome da tarefa técnica (ex: "Criar endpoint POST /api/v1/users").
"type": Exatamente um destes: "Feature", "Bug", "Automação", "Melhoria".
"points": Pontos de história (Story Points) de 1 a 8 baseados em fibonacci (1, 2, 3, 5, 8).

Demanda:
"${context}"`;

       const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      const text = response.text || '[]';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
       console.error('AI Error (Tasks):', err);
       return [];
    }
  }
}
