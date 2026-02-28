import { Injectable, inject } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { DataService } from './data.service';

export type AgentName = 'ana' | 'carla' | 'lucas' | 'orion';

const AGENT_PERSONAS = {
  ana: `Você é a Ana, a melhor SDR e Closer B2B do mercado de tecnologia. Você trabalha na agência Konig Systems (do CEO Matteuz), vendendo Landing Pages, Sistemas de Agendamento, Automação e Agentes de IA. Seu tom é humano, incisivo, altamente persuasivo e empático. Responda de forma direta e natural.`,
  carla: `Você é a Carla, uma Engenheira de Quality Assurance (QA) sênior e implacável. Você trabalha na Konig Systems. Seu tom é técnico, analítico, direto e um pouco cético. Você analisa relatos de bugs e exige passos de reprodução claros.`,
  lucas: `Você é o Lucas, Head de Customer Success (CS) e Account Manager da Konig Systems. Seu tom é extremamente empático, proativo, amigável e focado na retenção do cliente e aumento de LTV.`,
  orion: `Você é Orion, o Master Orchestrator (Engenheiro de IA e Arquiteto de Software) da Konig Systems. Seu tom é sábio, de comando, altamente técnico e voltado para eficiência (Você usa a expressão "Arrochar"). Você é o braço direito do CEO Matteuz.`
};

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private ai: GoogleGenAI | null = null;
  private dataService = inject(DataService);

  constructor() {
    this.initializeKey();
  }

  private async initializeKey() {
    // 1. Tenta pegar do banco (Supabase)
    try {
      const dbKey = await this.dataService.getSecret('GEMINI_API_KEY');
      if (dbKey) {
        this.configure(dbKey);
        return;
      }
    } catch (e) {
      console.warn('Secret GEMINI_API_KEY não encontrada no Supabase. Usando fallback.');
    }

    // 2. Fallback pro LocalStorage
    const localKey = localStorage.getItem('NEXUS_GEMINI_KEY');
    if (localKey) {
      this.configure(localKey);
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

  async chatWithAgent(agent: AgentName, message: string, context: string = '', blueprint: string = ''): Promise<string> {
    if (!this.ai) return '[Aviso: IA Offline. Configure a chave no Supabase ou LocalStorage.]';

    try {
      const systemInstruction = AGENT_PERSONAS[agent];
      const blueprintContext = blueprint ? `\nMAPA TÉCNICO DO SISTEMA DO CLIENTE:\n${blueprint}\n` : '';
      const prompt = `Contexto atual da Agência:\n${context}${blueprintContext}\n\nMensagem recebida:\n"${message}"\n\nResponda agora incorporando a sua persona:`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7
        }
      });

      return response.text || '';
    } catch (err) {
      console.error(`Erro na Mente da(o) ${agent}:`, err);
      return `[Erro Neural: Conexão com o córtex frontal da(o) ${agent} falhou.]`;
    }
  }

  async generateReproductionSteps(clientDescription: string): Promise<string> {
    if (!this.ai) return 'A IA da Carla está offline.';
    try {
      const prompt = `Como QA Sênior (Carla), traduza o relato: "${clientDescription}" em Markdown técnico.`;
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: { systemInstruction: AGENT_PERSONAS.carla }
      });
      return response.text || '';
    } catch (err) {
      return 'Erro ao gerar passos.';
    }
  }

  async analyzeTicket(description: string): Promise<{ priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica', summary: string }> {
    if (!this.ai) return { priority: 'Média', summary: 'IA Offline.' };
    try {
      const prompt = `Analise o ticket e retorne JSON {"priority": "Baixa"|"Média"|"Alta"|"Crítica", "summary": "15 palavras"}.\n\nTicket:\n"${description}"`;
      const response = await this.ai.models.generateContent({ model: 'gemini-2.0-flash', contents: prompt });
      const text = response.text || '{}';
      return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (err) {
      return { priority: 'Alta', summary: 'Falha.' };
    }
  }
}