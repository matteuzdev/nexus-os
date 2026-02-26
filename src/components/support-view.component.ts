import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Ticket, TicketStatus } from '../services/data.service';
import { AiService } from '../services/ai.service';
import { NexusDrawerComponent } from './nexus-drawer.component';

@Component({
  selector: 'app-support-view',
  standalone: true,
  imports: [CommonModule, FormsModule, NexusDrawerComponent],
  template: `
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full">
      <!-- Tickets Sidebar/List -->
      <div class="xl:col-span-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-black text-white uppercase tracking-tighter">Inbox de Suporte</h3>
          <span class="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{{ dataService.openTickets() }}</span>
        </div>
        
        @for (ticket of dataService.tickets(); track ticket.id) {
          <div (click)="selectedTicket.set(ticket)" 
            class="p-4 rounded-2xl border transition-all cursor-pointer group"
            [class]="selectedTicket()?.id === ticket.id ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'">
            <div class="flex justify-between items-start mb-2">
              <span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded"
                [class.bg-rose-500]="ticket.priority === 'Alta' || ticket.priority === 'Crítica'"
                [class.bg-zinc-700]="ticket.priority === 'Baixa' || ticket.priority === 'Média'">
                {{ ticket.priority }}
              </span>
              <span class="text-[8px] font-mono text-zinc-600">#{{ ticket.id.substring(2,6) }}</span>
            </div>
            <h4 class="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors truncate">{{ ticket.title }}</h4>
            <p class="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tighter">{{ ticket.client }}</p>
          </div>
        }
      </div>

      <!-- Ticket Command Center (Integrated with QA & Dev) -->
      <div class="xl:col-span-3 flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        @if (selectedTicket()) {
          <div class="h-full flex flex-col">
            <!-- Header -->
            <header class="p-8 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-start shrink-0">
              <div>
                <h2 class="text-2xl font-black text-white leading-tight mb-2 flex items-center gap-4">
                  {{ selectedTicket()!.title }}
                  <button (click)="openDrawer()" class="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                </h2>
                <div class="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <span class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-indigo-500"></div> {{ selectedTicket()!.client }}</span>
                  <span>•</span>
                  <span>{{ selectedTicket()!.createdAt | date:'medium' }}</span>
                </div>
              </div>
              <div class="flex flex-col items-end gap-2">
                <span class="text-[8px] text-zinc-600 uppercase font-black tracking-widest">Status do Chamado</span>
                <select [ngModel]="selectedTicket()!.status" (ngModelChange)="updateStatus($event)"
                  class="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                  <option value="Aberto">Aberto</option>
                  <option value="Em Análise">Em Análise (QA)</option>
                  <option value="Aguardando Dev">Aguardando Dev</option>
                  <option value="Resolvido">Resolvido</option>
                </select>
              </div>
            </header>

            <!-- Main Panel -->
            <div class="flex-1 overflow-y-auto p-8 custom-scrollbar grid grid-cols-1 lg:grid-cols-3 gap-8">
              <!-- Content -->
              <div class="lg:col-span-2 space-y-8">
                <div>
                  <h3 class="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Relato do Cliente
                  </h3>
                  <div class="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800 text-zinc-300 leading-relaxed italic shadow-inner">
                    "{{ selectedTicket()!.description }}"
                  </div>
                </div>

                <!-- QA Analysis Section -->
                <div class="p-6 bg-emerald-600/5 border border-emerald-500/20 rounded-3xl space-y-4">
                  <div class="flex justify-between items-center">
                    <h3 class="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Análise de Qualidade (Carla QA)
                    </h3>
                    @if (isAnalyzing()) {
                       <span class="text-[8px] bg-emerald-500 text-black px-2 py-0.5 rounded font-black animate-pulse uppercase flex items-center gap-1">
                         <svg class="animate-spin h-2 w-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                         A Mente de Carla está Analisando...
                       </span>
                    } @else {
                       <button (click)="generateQASteps()" [disabled]="!aiService.hasKey() || !!selectedTicket()!.reproductionSteps" 
                          class="text-[8px] bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded font-black uppercase transition-colors disabled:opacity-50 flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          Auto-Analisar com IA
                       </button>
                    }
                  </div>
                  
                  <div>
                    <label class="text-[10px] text-zinc-600 uppercase font-black block mb-2">Passos para Reproduzir / Notas Técnicas</label>
                    <textarea [(ngModel)]="selectedTicket()!.reproductionSteps" 
                      placeholder="Carla, descreva como reproduzir o erro antes de escalar..."
                      class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 outline-none focus:border-emerald-500 resize-none font-mono min-h-[100px]"></textarea>
                  </div>
                </div>

                <!-- Dev Integration Section (Jira Style) -->
                <div class="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-3xl space-y-4">
                  <h3 class="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    Conexão com Engenharia (Orion)
                  </h3>
                  
                  @if (selectedTicket()!.linkedTaskId) {
                    <div class="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800 group hover:border-indigo-500/50 transition-all cursor-pointer">
                      <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-black text-xs">DEV</div>
                        <div>
                          <p class="text-xs text-zinc-500 font-bold uppercase tracking-tighter">Tarefa Vinculada no Kanban</p>
                          <p class="text-sm font-bold text-white">#{{ selectedTicket()!.linkedTaskId.substring(1,6) }} - Em Execução</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2 text-indigo-500 group-hover:translate-x-1 transition-transform">
                        <span class="text-[10px] font-black uppercase">Ver no Board</span>
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                  } @else {
                    <div class="text-center py-6">
                      <p class="text-xs text-zinc-600 mb-4 font-bold italic">O ticket precisa ser validado pela QA antes da escalada técnica.</p>
                      <button (click)="escalate()" 
                        [disabled]="!selectedTicket()!.reproductionSteps"
                        class="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                        Escalar para Engenharia
                      </button>
                    </div>
                  }
                </div>
              </div>

              <!-- Sidebar Details -->
              <div class="space-y-6">
                <div class="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-xl">
                  <h4 class="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6">Metadados de Entrega</h4>
                  <div class="space-y-6">
                    <div>
                      <p class="text-[8px] text-zinc-500 font-black uppercase mb-1">Produto Afetado</p>
                      <p class="text-sm font-bold text-white">{{ dataService.getProductName(selectedTicket()!.linkedProductId) }}</p>
                    </div>
                    <div>
                      <p class="text-[8px] text-zinc-500 font-black uppercase mb-1">SLA de Resolução</p>
                      <div class="flex items-center gap-2">
                        <div class="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                        <p class="text-xs font-bold text-emerald-500">Dentro do Prazo ({{ selectedTicket()!.slaHours }}h)</p>
                      </div>
                    </div>
                    <div class="pt-4 border-t border-zinc-900">
                       <p class="text-[8px] text-zinc-500 font-black uppercase mb-3 text-center">Responsáveis Ativos</p>
                       <div class="flex justify-center -space-x-3">
                         <div class="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-[8px] font-black text-white" title="Lucas CS">LC</div>
                         <div class="w-8 h-8 rounded-full bg-emerald-600 border-2 border-zinc-950 flex items-center justify-center text-[8px] font-black text-white" title="Carla QA">CQ</div>
                         <div class="w-8 h-8 rounded-full bg-indigo-600 border-2 border-zinc-950 flex items-center justify-center text-[8px] font-black text-white" title="Orion Dev">OX</div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="h-full flex flex-col items-center justify-center text-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/5 via-zinc-950 to-zinc-950">
            <div class="w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center mb-8 border border-zinc-800 shadow-2xl transform rotate-3">
              <svg class="w-12 h-12 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <h3 class="text-2xl font-black text-white uppercase tracking-tighter">Nexus Support Center</h3>
            <p class="text-xs text-zinc-600 mt-4 max-w-xs uppercase font-bold tracking-[0.2em] leading-relaxed">Aguardando seleção de ticket para iniciar orquestração de suporte.</p>
          </div>
        }
      </div>
    </div>
    
    <app-nexus-drawer 
      [isOpen]="isDrawerOpen()" 
      [type]="'ticket'" 
      [data]="selectedTicket()" 
      (close)="closeDrawer()">
    </app-nexus-drawer>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 2px; }
  `]
})
export class SupportViewComponent {
  dataService = inject(DataService);
  aiService = inject(AiService);

  selectedTicket = signal<Ticket | null>(null);
  isDrawerOpen = signal(false);
  isAnalyzing = signal(false);

  updateStatus(newStatus: TicketStatus) {
    if (this.selectedTicket()) {
      this.dataService.updateTicketStatus(this.selectedTicket()!.id, newStatus);
    }
  }

  escalate() {
    if (this.selectedTicket()) {
      // 1. Escalate to DB
      this.dataService.escalateTicketToDev(this.selectedTicket()!.id);
      
      // 2. Notify Chat - Using Real Carla Mind
      const messageToOrion = `Ticket ${this.selectedTicket()!.title} validado. Bugs detalhados: ${this.selectedTicket()!.reproductionSteps}. Arrocha no hotfix, Orion!`;
      this.dataService.sendMessage(messageToOrion, 'Carla QA', false);
      this.dataService.addXP('m4', 20); // Carla did her job

      // 3. Refresh view
      setTimeout(() => {
        const updated = this.dataService.tickets().find(t => t.id === this.selectedTicket()!.id);
        if (updated) this.selectedTicket.set({ ...updated });
      }, 500);
    }
  }
  
  async generateQASteps() {
    if (this.selectedTicket() && this.aiService.hasKey()) {
      this.isAnalyzing.set(true);
      const steps = await this.aiService.generateReproductionSteps(this.selectedTicket()!.description);
      
      const updatedTicket = { ...this.selectedTicket()!, reproductionSteps: steps };
      this.selectedTicket.set(updatedTicket);
      
      this.isAnalyzing.set(false);
    }
  }
  
  openDrawer() {
    if(this.selectedTicket()) this.isDrawerOpen.set(true);
  }
  
  closeDrawer() {
    this.isDrawerOpen.set(false);
    this.selectedTicket.set(null);
  }
}