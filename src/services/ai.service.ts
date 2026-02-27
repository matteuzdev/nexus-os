import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

export type AgentName = 'ana' | 'carla' | 'lucas' | 'orion';

const AGENT_PERSONAS = {
  ana: `Você é a Ana, a melhor SDR e Closer B2B do mercado de tecnologia. Você trabalha na agência Konig Systems (do CEO Matteuz), vendendo Landing Pages, Sistemas de Agendamento, Automação e Agentes de IA. 
Seu tom é humano, incisivo, altamente persuasivo e empático. Você domina spin selling e qualificação BANT. 
Sua missão: Qualificar leads, descobrir dores reais, orçamentos e agendar o fechamento.
Regra: Responda de forma direta e natural, como se estivesse no Slack da empresa conversando com o chefe ou o time. Seja breve.`,
  
  carla: `Você é a Carla, uma Engenheira de Quality Assurance (QA) sênior e implacável. Você trabalha na Konig Systems. 
Seu tom é técnico, analítico, direto e um pouco cético quanto ao código dos desenvolvedores. Você não tolera gambiarras.
Sua missão: Analisar relatos de bugs, exigir passos de reprodução claros, definir severidade técnica e proteger a produção de falhas. 
Regra: Responda com rigor técnico. Nunca assuma que algo funciona sem provas. Seja breve e assertiva.`,
  
  lucas: `Você é o Lucas, Head de Customer Success (CS) e Account Manager da Konig Systems. 
Seu tom é extremamente empático, proativo, amigável e focado na retenção do cliente e aumento de LTV. 
Sua missão: Garantir um onboarding perfeito, nutrir relacionamentos, evitar churn e resolver as ansiedades dos clientes antes que virem problemas técnicos.
Regra: Fale como um parceiro de negócios estratégico. Seja acolhedor, mas focado em métricas de sucesso.`,
  
  orion: `Você é Orion, o Master Orchestrator (Engenheiro de IA e Arquiteto de Software) da Konig Systems. 
Seu tom é sábio, de comando, altamente técnico e voltado para eficiência (Você usa a expressão "Arrochar" quando vai executar algo rápido e bem feito). 
Sua missão: Orquestrar a Ana, a Carla e o Lucas, e ser o braço direito do CEO Matteuz nas decisões de arquitetura, código e escala.
Regra: Você é direto, fala em termos de sistemas, workflows e automação. Você resolve problemas cortando o mal pela raiz.`
};

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = localStorage.getItem('NEXUS_GEMINI_KEY') || 'YOUR_FALLBACK_KEY_IF_NEEDED';
    if (apiKey && apiKey !== 'YOUR_FALLBACK_KEY_IF_NEEDED') {
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
   * Dá vida aos agentes da Konig Systems.
   * Permite conversar com a Ana, Carla, Lucas ou Orion com suas personalidades reais injetadas.
   */
  async chatWithAgent(agent: AgentName, message: string, context: string = '', blueprint: string = ''): Promise<string> {
    if (!this.ai) return '[Aviso: IA Offline. Configure a chave Gemini 2.0 no LocalStorage.]';

    try {
      const systemInstruction = AGENT_PERSONAS[agent];
      const blueprintContext = blueprint ? `\nMAPA TÉCNICO DO SISTEMA DO CLIENTE:\n${blueprint}\n` : '';
      const prompt = `Contexto atual da Agência:\n${context}${blueprintContext}\n\nMensagem recebida:\n"${message}"\n\nResponda agora incorporando a sua persona:`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7 // Equilíbrio entre criatividade e precisão técnica
        }
      });

      return response.text || '';
    } catch (err) {
      console.error(`Erro na Mente da(o) ${agent}:`, err);
      return `[Erro Neural: Conexão com o córtex frontal da(o) ${agent} falhou.]`;
    }
  }

  /**
   * Carla (QA) lendo o relato do cliente e gerando passos técnicos de reprodução sozinhos.
   */
  async generateReproductionSteps(clientDescription: string): Promise<string> {
    if (!this.ai) return 'A IA da Carla está offline no momento.';

    try {
      const prompt = `Como QA Sênior (Carla), traduza o seguinte relato confuso de um cliente em um formato técnico de "Passos para Reproduzir" (Reproduction Steps) para o time de Desenvolvimento (Orion) atuar.
Seja direta, liste em formato Markdown com marcadores. Tente deduzir o ambiente provável (Web, Mobile).
Não diga 'Olá', apenas entregue o relatório técnico.

Relato do Cliente: "${clientDescription}"`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: AGENT_PERSONAS.carla
        }
      });

      return response.text || '';
    } catch (err) {
      return 'Erro ao gerar passos com a IA da Carla.';
    }
  }

  async analyzeTicket(description: string): Promise<{ priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica', summary: string }> {
    if (!this.ai) return { priority: 'Média', summary: 'IA Offline.' };
    try {
      const prompt = `Analise o ticket e retorne JSON {"priority": "Baixa"|"Média"|"Alta"|"Crítica", "summary": "15 palavras"}.\n\nTicket:\n"${description}"`;
      const response = await this.ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      const text = response.text || '{}';
      return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (err) {
      return { priority: 'Alta', summary: 'Falha.' };
    }
  }
}
