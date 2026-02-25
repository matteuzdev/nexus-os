import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, TicketPriority } from '../services/data.service';
import { AiService } from '../services/ai.service';

@Component({
  selector: 'app-public-website',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-zinc-950 text-white font-sans selection:bg-indigo-500/30 overflow-y-auto custom-scrollbar">
      
      <!-- Navbar -->
      <nav class="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <!-- Logo Konig -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span class="text-xl font-bold tracking-tight">Konig Systems</span>
          </div>

          <div class="flex items-center gap-6">
            <a href="#services" class="text-sm text-zinc-400 hover:text-white transition-colors hidden md:block">Serviços</a>
            <a href="#support" class="text-sm text-zinc-400 hover:text-white transition-colors hidden md:block">Suporte</a>
            <button (click)="login.emit()" class="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-zinc-700 rounded hover:bg-zinc-800 transition-colors">
              Área do Cliente / Admin
            </button>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative py-24 px-6 border-b border-zinc-800 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950">
        <div class="max-w-4xl mx-auto text-center">
          <span class="inline-block px-3 py-1 mb-6 text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 rounded-full">
            Estúdio de Tecnologia Digital
          </span>
          <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Construindo o futuro<br>linha por linha.
          </h1>
          <p class="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Especialistas em transformar complexidade em sistemas elegantes. Sites Inteligentes, SaaS e Automação com IA.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#support" class="px-8 py-3 bg-white text-black font-bold rounded hover:bg-zinc-200 transition-colors w-full sm:w-auto">
              Falar com Especialista
            </a>
            <a href="#services" class="px-8 py-3 border border-zinc-700 text-zinc-300 font-medium rounded hover:bg-zinc-900 transition-colors w-full sm:w-auto">
              Nossos Serviços
            </a>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section id="services" class="py-24 px-6 bg-zinc-950">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold mb-16 text-center">O Ecossistema Konig</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Card 1 -->
            <div class="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 transition-colors group">
              <div class="w-12 h-12 bg-emerald-900/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 class="text-xl font-bold mb-3">Sites & Landing Pages</h3>
              <p class="text-zinc-400 leading-relaxed text-sm">
                Não apenas sites bonitos. Plataformas de conversão com funcionalidades integradas: agendamentos, pagamentos e áreas de membros. Ideal para barbearias, clínicas e consultorias.
              </p>
            </div>

            <!-- Card 2 -->
            <div class="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 transition-colors group">
              <div class="w-12 h-12 bg-indigo-900/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <h3 class="text-xl font-bold mb-3">Desenvolvimento de Produtos</h3>
              <p class="text-zinc-400 leading-relaxed text-sm">
                Tiramos sua ideia do papel. Desenvolvimento full-cycle de SaaS, Aplicativos Mobile e Sistemas Web complexos. Arquitetura escalável desde o dia 1.
              </p>
            </div>

            <!-- Card 3 -->
            <div class="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-purple-500/50 transition-colors group">
              <div class="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 class="text-xl font-bold mb-3">Automação & IA</h3>
              <p class="text-zinc-400 leading-relaxed text-sm">
                Agentes de IA que atendem clientes, fluxos n8n que conectam seu CRM ao Financeiro. Otimizamos sua operação para você focar no estratégico.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Support Section -->
      <section id="support" class="py-24 px-6 bg-zinc-900 border-t border-zinc-800">
        <div class="max-w-3xl mx-auto">
          <div class="flex items-center justify-center gap-3 mb-8">
             <div class="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-[10px] font-bold">N</div>
             <span class="text-zinc-500 text-sm font-mono tracking-widest uppercase">Powered by Nexus OS</span>
          </div>
          
          <h2 class="text-3xl font-bold mb-4 text-center">Abrir Chamado</h2>
          <p class="text-zinc-400 text-center mb-10">
            Já é cliente Konig? Descreva sua solicitação abaixo e nosso sistema Nexus a encaminhará diretamente para a esteira de desenvolvimento.
          </p>

          <form (submit)="submitTicket($event)" class="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
            @if (successMessage()) {
              <div class="mb-6 p-4 bg-emerald-900/30 border border-emerald-900 rounded text-emerald-400 text-center text-sm animate-in fade-in slide-in-from-top-2 flex items-center justify-center gap-2">
                 <svg class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span [innerHTML]="successMessage()"></span>
              </div>
            }

            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-bold text-zinc-500 uppercase mb-2">Seu Nome / Empresa</label>
                  <input name="client" [(ngModel)]="form.client" [disabled]="isSubmitting()" required class="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors disabled:opacity-50" placeholder="Ex: Barbearia Silva">
                </div>
                <div>
                  <label class="block text-xs font-bold text-zinc-500 uppercase mb-2">Tipo de Projeto</label>
                  <select name="type" [(ngModel)]="form.linkedProductId" [disabled]="isSubmitting()" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors appearance-none disabled:opacity-50">
                    <option value="" disabled selected>Selecione um serviço...</option>
                    @for (prod of dataService.products(); track prod.id) {
                      <option [value]="prod.id">{{ prod.name }}</option>
                    }
                    <option value="other">Outro / Comercial</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase mb-2">Assunto</label>
                <input name="title" [(ngModel)]="form.title" [disabled]="isSubmitting()" required class="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors disabled:opacity-50" placeholder="Ex: Ajuste no agendamento do site">
              </div>

              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase mb-2">Descrição Detalhada</label>
                <textarea name="desc" [(ngModel)]="form.description" [disabled]="isSubmitting()" required rows="4" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition-colors resize-none disabled:opacity-50" placeholder="Como podemos ajudar?"></textarea>
              </div>

              <button type="submit" [disabled]="isSubmitting()" class="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                @if (isSubmitting()) {
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processando via Nexus AI...
                } @else {
                  Enviar Chamado Seguro
                }
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-12 bg-zinc-950 border-t border-zinc-900 text-center">
        <p class="text-zinc-600 text-sm">© 2024 Konig Systems. Todos os direitos reservados.</p>
      </footer>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #09090b; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
  `]
})
export class PublicWebsiteComponent {
  dataService = inject(DataService);
  aiService = inject(AiService);
  login = output<void>(); 

  form = {
    client: '',
    title: '',
    description: '',
    linkedProductId: ''
  };

  successMessage = signal('');
  isSubmitting = signal(false);

  async submitTicket(e: Event) {
    e.preventDefault();
    if (!this.form.client || !this.form.title) return;

    this.isSubmitting.set(true);

    try {
      // 1. AI Analysis Phase
      const analysis = await this.aiService.analyzeTicket(this.form.description);
      
      // 2. Data Persistence Phase
      this.dataService.addTicket({
        title: this.form.title,
        client: this.form.client,
        description: this.form.description,
        priority: analysis.priority as TicketPriority,
        linkedProductId: this.form.linkedProductId || 'p4'
      });

      this.successMessage.set(`Solicitação processada pela Inteligência do Nexus OS.<br>Prioridade Automática: <strong>${analysis.priority}</strong>.<br>Ticket criado!`);
      
      this.form = { client: '', title: '', description: '', linkedProductId: '' };
      setTimeout(() => this.successMessage.set(''), 8000);
    } catch (err) {
      console.error(err);
      this.successMessage.set('Erro ao processar. Tente novamente mais tarde.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}