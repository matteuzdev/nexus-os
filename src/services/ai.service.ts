import { Injectable, inject } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { DataService } from './data.service';

export type AgentName = 'ana' | 'carla' | 'lucas' | 'orion';

const AGENT_PERSONAS = {
  ana: `Você é a Ana, a melhor SDR e Closer B2B da Konig Systems. Você vende Landing Pages e Agentes de IA. Seu tom é incisivo e persuasivo.`,
  carla: `Você é a Carla, Engenheira de QA sênior da Konig Systems. Você analisa bugs com rigor técnico e ceticismo.`,
  lucas: `Você é o Lucas, Head de Customer Success da Konig Systems. Você foca em retenção e satisfação do cliente.`,
  orion: `Você é Orion, o Master Orchestrator da Konig Systems. Você é o braço direito do CEO Matteuz. Você arrocha nos sistemas.`
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
    // 1. Tenta pegar do banco (Supabase) com o nome que você configurou
    try {
      const dbKey = await this.dataService.getSecret('NEXUS_GEMINY_KEY');
      if (dbKey) {
        this.configure(dbKey);
        return;
      }
    } catch (e) {
      console.warn('Secret não encontrada no Supabase.');
    }

    // 2. Fallback pro LocalStorage com o nome corrigido (GEMINY)
    const localKey = localStorage.getItem('NEXUS_GEMINY_KEY');
    if (localKey) {
      this.configure(localKey);
    }
  }

  configure(apiKey: string) {
    try {
      this.ai = new GoogleGenAI({ apiKey });
      localStorage.setItem('NEXUS_GEMINY_KEY', apiKey);
      console.log('[Nexus AI] Motor Gemini 2.0 Flash Inicializado.');
    } catch (e) {
      console.error('Erro ao configurar Gemini AI:', e);
    }
  }

  hasKey(): boolean {
    return !!this.ai;
  }

  async chatWithAgent(agent: AgentName, message: string, context: string = '', blueprint: string = ''): Promise<string> {
    if (!this.ai) return '[Aviso: IA Offline. Configure a chave NEXUS_GEMINY_KEY no Supabase ou LocalStorage.]';

    try {
      const systemInstruction = AGENT_PERSONAS[agent];
      const blueprintContext = blueprint ? `\nCONTEXTO TÉCNICO DO PROJETO:\n${blueprint}\n` : '';
      const prompt = `Contexto:\n${context}${blueprintContext}\n\nMensagem: "${message}"\n\nResponda como sua persona:`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash', // Versão 2.0 Flash (A mais atual e funcional disponível no SDK)
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7
        }
      });

      return response.text || '';
    } catch (err) {
      console.error(`Erro na(o) ${agent}:`, err);
      return `[Conexão falhou. Verifique se a chave NEXUS_GEMINY_KEY é válida.]`;
    }
  }

  async generateReproductionSteps(clientDescription: string): Promise<string> {
    if (!this.ai) return 'QA Offline.';
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Como QA, descreva os passos para reproduzir: "${clientDescription}"`,
        config: { systemInstruction: AGENT_PERSONAS.carla }
      });
      return response.text || '';
    } catch (err) {
      return 'Erro na análise.';
    }
  }

  async analyzeTicket(description: string): Promise<{ priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica', summary: string }> {
    if (!this.ai) return { priority: 'Média', summary: 'IA Offline.' };
    try {
      const prompt = `Analise o ticket e retorne JSON {"priority": "Baixa"|"Média"|"Alta"|"Crítica", "summary": "15 palavras"}.\n\nTicket: "${description}"`;
      const response = await this.ai.models.generateContent({ model: 'gemini-2.0-flash', contents: prompt });
      const text = response.text || '{}';
      return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (err) {
      return { priority: 'Alta', summary: 'Falha na análise.' };
    }
  }
}