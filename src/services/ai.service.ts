import { Injectable, inject } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { DataService } from './data.service';

export type AgentName = 'ana' | 'carla' | 'lucas' | 'orion';

const AGENT_PERSONAS = {
  ana: `Você é a Ana_SDR da Konig Systems. Seu tom é incisivo e focado em fechar negócios. Responda como se estivesse no chat da empresa.`,
  carla: `Você é a Carla_QA da Konig Systems. Seu tom é técnico e rigoroso com bugs.`,
  lucas: `Você é o Lucas_CS da Konig Systems. Seu tom é amigável e focado no sucesso do cliente.`,
  orion: `Você é Orion_Master, orquestrador da Konig Systems. Arroche nos sistemas.`
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
    // 1. Tenta pegar das variáveis de ambiente do Build (Vercel)
    const envKey = (import.meta as any).env?.['VITE_GEMINI_API_KEY'] || (import.meta as any).env?.['GEMINI_API_KEY'];
    if (envKey) {
      this.configure(envKey);
      return;
    }

    try {
      // 2. Tenta pegar do banco (Supabase)
      const dbKey = await this.dataService.getSecret('GEMINI_API_KEY');
      if (dbKey) {
        this.configure(dbKey);
        return;
      }
    } catch (e) {}

    // 3. Fallback pro LocalStorage
    const localKey = localStorage.getItem('GEMINI_API_KEY');
    if (localKey) this.configure(localKey);
  }

  configure(apiKey: string) {
    try {
      this.ai = new GoogleGenAI({ apiKey });
      localStorage.setItem('GEMINI_API_KEY', apiKey);
      console.log('[Nexus AI] Motor Gemini Live.');
    } catch (e) {
      console.error('Erro ao configurar AI:', e);
    }
  }

  hasKey(): boolean { return !!this.ai; }

  async chatWithAgent(agent: AgentName, message: string, context: string = '', blueprint: string = ''): Promise<string> {
    if (!this.ai) return '[IA Offline. Configure GEMINI_API_KEY.]';
    try {
      const blueprintContext = blueprint ? `\nMAPA TÉCNICO: ${blueprint}\n` : '';
      const prompt = `${AGENT_PERSONAS[agent]}\n\nContexto: ${context}${blueprintContext}\n\nMensagem: "${message}"`;
      
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.1-flash', 
        contents: prompt,
        config: { temperature: 0.7 }
      });

      const text = response.text || '';
      const agentLabel = agent.charAt(0).toUpperCase() + agent.slice(1);
      await this.dataService.notifyTeam(`${agentLabel} responding...`, text);
      return text;
    } catch (err) {
      return `[Falha na conexão com a(o) ${agent}. Verifique a chave.]`;
    }
  }

  async generateReproductionSteps(clientDescription: string): Promise<string> {
    if (!this.ai) return 'QA Offline.';
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.1-flash',
        contents: `Como QA, analise: "${clientDescription}"`
      });
      return response.text || '';
    } catch (err) { return 'Erro.'; }
  }

  async analyzeTicket(description: string): Promise<any> {
    if (!this.ai) return { priority: 'Média', summary: 'Offline' };
    try {
      const response = await this.ai.models.generateContent({ 
        model: 'gemini-3.1-flash', 
        contents: `Analise em JSON {"priority": "Alta"|"Média"|"Baixa", "summary": "texto"}: ${description}` 
      });
      return JSON.parse(response.text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (err) { return { priority: 'Média', summary: 'Falha' }; }
  }
}