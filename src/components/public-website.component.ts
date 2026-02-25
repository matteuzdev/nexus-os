import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-public-website',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-zinc-950 text-white font-sans selection:bg-indigo-500/30 overflow-y-auto custom-scrollbar">
      
      <!-- Navbar -->
      <nav class="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span class="text-xl font-bold tracking-tight">Konig Systems</span>
          </div>

          <div class="flex items-center gap-6">
            <a href="#services" class="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors hidden md:block">Serviços</a>
            <a href="#contact" class="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors hidden md:block">Projetos</a>
            <button (click)="support.emit()" class="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors hidden md:block">Abrir Chamado (Suporte)</button>
            <button (click)="login.emit()" class="px-6 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-indigo-500 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">
              Nexus OS Login
            </button>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative py-32 px-6 border-b border-zinc-800 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950">
        <div class="max-w-4xl mx-auto text-center">
          <span class="inline-block px-4 py-1.5 mb-8 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 rounded-full">
            Estúdio de Tecnologia Digital
          </span>
          <h1 class="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent leading-[0.9]">
            Construindo o futuro<br>linha por linha.
          </h1>
          <p class="text-lg text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Transformamos complexidade em sistemas elegantes. Sites Inteligentes, SaaS, CRMs Personalizados e Automação com IA de ponta a ponta.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#contact" class="px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-colors w-full sm:w-auto shadow-xl shadow-white/10">
              Solicitar Orçamento
            </a>
            <a href="#services" class="px-8 py-4 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors w-full sm:w-auto">
              Nossos Serviços
            </a>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section id="services" class="py-32 px-6 bg-zinc-950">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-4xl font-black mb-20 text-center tracking-tighter">O Ecossistema Konig</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-10 bg-zinc-900/30 border border-zinc-800 rounded-3xl hover:border-emerald-500/50 transition-colors group">
              <div class="w-14 h-14 bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg class="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 class="text-xl font-bold mb-4">Plataformas de Conversão</h3>
              <p class="text-zinc-400 leading-relaxed text-sm">
                Não apenas sites bonitos. Landing pages integradas com CRMs, pagamentos, agendamentos e áreas de membros. Design premium e performance extrema.
              </p>
            </div>

            <div class="p-10 bg-zinc-900/30 border border-zinc-800 rounded-3xl hover:border-indigo-500/50 transition-colors group">
              <div class="w-14 h-14 bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg class="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <h3 class="text-xl font-bold mb-4">Sistemas Complexos (SaaS)</h3>
              <p class="text-zinc-400 leading-relaxed text-sm">
                Tiramos sua ideia do papel. Desenvolvimento full-cycle de SaaS e CRMs (como este próprio Nexus OS que você está usando).
              </p>
            </div>

            <div class="p-10 bg-zinc-900/30 border border-zinc-800 rounded-3xl hover:border-purple-500/50 transition-colors group">
              <div class="w-14 h-14 bg-purple-900/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <svg class="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 class="text-xl font-bold mb-4">Agentes & IA</h3>
              <p class="text-zinc-400 leading-relaxed text-sm">
                Automatize sua operação. Criamos agentes de IA que atendem via WhatsApp, analisam planilhas e gerenciam seu financeiro enquanto você foca no crescimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact / Lead Capture Section -->
      <section id="contact" class="py-32 px-6 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/10 via-zinc-950 to-zinc-950 border-t border-zinc-900">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-black mb-4 tracking-tighter">Inicie um Projeto</h2>
            <p class="text-zinc-400">
              Transforme sua ideia em tecnologia palpável. Preencha os dados e nosso time entrará em contato.
            </p>
          </div>

          <form (submit)="submitLead($event)" class="bg-zinc-900/30 p-10 rounded-[2rem] border border-zinc-800 backdrop-blur-sm">
            @if (successMessage()) {
              <div class="mb-8 p-6 bg-emerald-900/20 border border-emerald-500/30 rounded-2xl text-emerald-400 text-center text-sm animate-in fade-in slide-in-from-top-2 flex flex-col items-center justify-center gap-3">
                <div class="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                   <svg class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                 </div>
                {{ successMessage() }}
              </div>
            }

            <div class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Nome ou Empresa</label>
                  <input name="company" [(ngModel)]="form.company" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none transition-colors">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Seu Nome (Contato)</label>
                  <input name="contact" [(ngModel)]="form.contact" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none transition-colors">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">E-mail Corporativo</label>
                  <input type="email" name="email" [(ngModel)]="form.email" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none transition-colors">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">WhatsApp</label>
                  <input name="phone" [(ngModel)]="form.phone" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none transition-colors">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Orçamento Estimado</label>
                  <select name="budget" [(ngModel)]="form.budgetRange" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none transition-colors appearance-none">
                    <option value="Até R$ 5.000">Até R$ 5.000</option>
                    <option value="R$ 5.000 a R$ 15.000">R$ 5.000 a R$ 15.000</option>
                    <option value="R$ 15.000 a R$ 50.000">R$ 15.000 a R$ 50.000</option>
                    <option value="Acima de R$ 50.000">Acima de R$ 50.000</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Setor</label>
                  <input name="industry" [(ngModel)]="form.industry" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none transition-colors" placeholder="Ex: E-commerce, Clínica, Advocacia">
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Conte sobre o seu Projeto</label>
                <textarea name="notes" [(ngModel)]="form.notes" required rows="5" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none transition-colors resize-none" placeholder="O que você precisa automatizar ou construir?"></textarea>
              </div>

              <button type="submit" class="w-full py-5 bg-white hover:bg-zinc-200 text-black text-[10px] uppercase tracking-widest font-black rounded-xl transition-all shadow-xl shadow-white/5">
                Enviar Proposta para a Konig
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-16 bg-zinc-950 border-t border-zinc-900 text-center">
        <p class="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-4">© 2024 Konig Systems. Todos os direitos reservados.</p>
        <button (click)="support.emit()" class="text-indigo-500 hover:text-indigo-400 text-xs font-bold underline">Portal de Suporte ao Cliente</button>
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
  
  login = output<void>(); 
  support = output<void>();

  form = {
    company: '',
    contact: '',
    email: '',
    phone: '',
    budgetRange: 'R$ 5.000 a R$ 15.000',
    industry: '',
    notes: ''
  };

  successMessage = signal('');

  submitLead(e: Event) {
    e.preventDefault();
    if (!this.form.company || !this.form.contact) return;

    this.dataService.addLead({
      company: this.form.company,
      contact: this.form.contact,
      email: this.form.email,
      phone: this.form.phone,
      value: 0, 
      status: 'Lead',
      source: 'Site Publico',
      investigation: {
        industry: this.form.industry,
        companySize: 'Desconhecido',
        painPoints: '',
        techStack: '',
        budgetRange: this.form.budgetRange,
        decisionMaker: this.form.contact,
        notes: this.form.notes
      }
    });

    this.successMessage.set(`Recebemos sua solicitação! Um consultor da Konig Systems entrará em contato em breve.`);
    
    this.form = { company: '', contact: '', email: '', phone: '', budgetRange: 'R$ 5.000 a R$ 15.000', industry: '', notes: '' };
    setTimeout(() => this.successMessage.set(''), 6000);
  }
}