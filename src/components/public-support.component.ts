import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, TicketPriority } from '../services/data.service';
import { AiService } from '../services/ai.service';

@Component({
  selector: 'app-public-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-zinc-950 text-white font-sans selection:bg-indigo-500/30 overflow-y-auto custom-scrollbar flex flex-col">
      
      <!-- Navbar -->
      <nav class="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 shrink-0">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-rose-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <span class="text-xl font-bold tracking-tight">Konig Support Center</span>
          </div>

          <div class="flex items-center gap-6">
            <button (click)="back.emit()" class="text-sm text-zinc-400 hover:text-white transition-colors">Voltar para o Site</button>
          </div>
        </div>
      </nav>

      <!-- Support Section -->
      <section class="flex-1 py-16 px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-zinc-950 to-zinc-950 flex items-center justify-center">
        <div class="max-w-3xl w-full">
          <div class="flex items-center justify-center gap-3 mb-6">
             <div class="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-[10px] font-bold">N</div>
             <span class="text-zinc-500 text-xs font-mono tracking-widest uppercase font-bold">Powered by Nexus OS</span>
          </div>
          
          <h2 class="text-4xl font-black mb-4 text-center tracking-tighter">Abrir Chamado Técnico</h2>
          <p class="text-zinc-400 text-center mb-10 max-w-lg mx-auto leading-relaxed">
            Nossa equipe de Customer Success e Quality Assurance já está de prontidão para resolver seu problema.
          </p>

          <form (submit)="submitTicket($event)" class="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800 shadow-2xl backdrop-blur-md">
            @if (successMessage()) {
              <div class="mb-8 p-6 bg-emerald-900/20 border border-emerald-500/30 rounded-2xl text-emerald-400 text-center text-sm animate-in fade-in slide-in-from-top-2 flex flex-col items-center justify-center gap-4">
                 <div class="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                   <svg class="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                <span [innerHTML]="successMessage()" class="leading-relaxed"></span>
              </div>
            }

            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Sua Empresa</label>
                  <input name="client" [(ngModel)]="form.client" [disabled]="isSubmitting()" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors disabled:opacity-50" placeholder="Ex: Barbearia Silva">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Produto Afetado</label>
                  <select name="type" [(ngModel)]="form.linkedProductId" [disabled]="isSubmitting()" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors appearance-none disabled:opacity-50">
                    <option value="" disabled selected>Selecione um sistema...</option>
                    @for (prod of dataService.products(); track prod.id) {
                      <option [value]="prod.id">{{ prod.name }}</option>
                    }
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Resumo do Problema</label>
                <input name="title" [(ngModel)]="form.title" [disabled]="isSubmitting()" required class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors disabled:opacity-50" placeholder="Ex: O botão de pagamento sumiu da tela">
              </div>

              <div>
                <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Descrição Detalhada</label>
                <textarea name="desc" [(ngModel)]="form.description" [disabled]="isSubmitting()" required rows="5" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors resize-none disabled:opacity-50" placeholder="Nos conte exatamente o que aconteceu e os passos que você fez..."></textarea>
              </div>

              <button type="submit" [disabled]="isSubmitting() || successMessage() !== ''" class="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs uppercase tracking-widest font-black rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-3">
                @if (isSubmitting()) {
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  IA Analisando Chamado...
                } @else {
                  Enviar para a Konig Systems
                }
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-8 bg-zinc-950 border-t border-zinc-900 text-center shrink-0">
        <p class="text-zinc-600 text-[10px] font-black uppercase tracking-widest">© 2024 Konig Systems Support. Powered by Nexus OS.</p>
      </footer>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #09090b; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
  `]
})
export class PublicSupportComponent {
  dataService = inject(DataService);
  aiService = inject(AiService);
  
  back = output<void>(); 

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
    if (!this.form.client || !this.form.title || !this.form.linkedProductId) return;

    this.isSubmitting.set(true);

    try {
      const analysis = await this.aiService.analyzeTicket(this.form.description);
      
      let sla = 24;
      if (analysis.priority === 'Crítica') sla = 2;
      else if (analysis.priority === 'Alta') sla = 4;
      else if (analysis.priority === 'Média') sla = 8;

      this.dataService.addTicket({
        title: this.form.title,
        client: this.form.client,
        description: this.form.description,
        priority: analysis.priority as TicketPriority,
        linkedProductId: this.form.linkedProductId,
        slaHours: sla
      });

      this.successMessage.set(`Chamado recebido e classificado por nossa IA.<br>SLA de Resposta: <strong>${sla} Horas</strong>.<br>Acompanhe seu email para atualizações.`);
      
      this.form = { client: '', title: '', description: '', linkedProductId: '' };
      setTimeout(() => {
        this.successMessage.set('');
        this.back.emit();
      }, 6000);
    } catch (err) {
      console.error(err);
      this.successMessage.set('Erro ao processar. Tente novamente mais tarde.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}