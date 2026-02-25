import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Ticket, TicketStatus } from '../services/data.service';
import { NexusDrawerComponent } from './nexus-drawer.component';

@Component({
  selector: 'app-support-view',
  standalone: true,
  imports: [CommonModule, NexusDrawerComponent],
  template: `
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full">
      <!-- Tickets Sidebar/List -->
      <div class="xl:col-span-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
        <h3 class="text-xl font-black text-white uppercase tracking-tighter mb-4">Inbox de Suporte</h3>
        
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
              <span class="text-[8px] font-mono text-zinc-600">#{{ ticket.id }}</span>
            </div>
            <h4 class="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors truncate">{{ ticket.title }}</h4>
            <p class="text-[10px] text-zinc-500 mt-1">{{ ticket.client }}</p>
          </div>
        }
      </div>

      <!-- Ticket Command Center (Integrated with Dev) -->
      <div class="xl:col-span-3 flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        @if (selectedTicket()) {
          <div class="h-full flex flex-col">
            <!-- Header -->
            <header class="p-8 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-start shrink-0">
              <div>
                <h2 class="text-2xl font-black text-white leading-tight mb-2">{{ selectedTicket()!.title }}</h2>
                <div class="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <span class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-indigo-500"></div> {{ selectedTicket()!.client }}</span>
                  <span>•</span>
                  <span>{{ selectedTicket()!.createdAt | date:'medium' }}</span>
                </div>
              </div>
              <div class="flex gap-2">
                <select [ngModel]="selectedTicket()!.status" (ngModelChange)="updateStatus($event)"
                  class="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-indigo-500 appearance-none">
                  <option value="Aberto">Aberto</option>
                  <option value="Em Análise">Em Análise</option>
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
                  <h3 class="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Descrição do Problema</h3>
                  <div class="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800 text-zinc-300 leading-relaxed italic">
                    "{{ selectedTicket()!.description }}"
                  </div>
                </div>

                <!-- Dev Integration Section (Jira Style) -->
                <div class="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-3xl space-y-4">
                  <h3 class="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    Conexão com Engenharia
                  </h3>
                  
                  @if (selectedTicket()!.linkedTaskId) {
                    <div class="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800 group hover:border-indigo-500/50 transition-all cursor-pointer">
                      <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-black text-xs">DEV</div>
                        <div>
                          <p class="text-xs text-zinc-500 font-bold uppercase tracking-tighter">Tarefa Vinculada</p>
                          <p class="text-sm font-bold text-white">#{{ selectedTicket()!.linkedTaskId }} - Em Execução</p>
                        </div>
                      </div>
                      <svg class="w-5 h-5 text-zinc-700 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  } @else {
                    <div class="text-center py-6">
                      <p class="text-xs text-zinc-600 mb-4 font-bold">Nenhuma tarefa técnica criada para este ticket ainda.</p>
                      <button (click)="escalate()" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">
                        Escalar para Engenharia (Jira Style)
                      </button>
                    </div>
                  }
                </div>
              </div>

              <!-- Sidebar Details -->
              <div class="space-y-6">
                <div class="p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
                  <h4 class="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Metadados do Cliente</h4>
                  <div class="space-y-4">
                    <div>
                      <p class="text-[8px] text-zinc-500 font-bold uppercase">Produto Afetado</p>
                      <p class="text-xs font-bold text-zinc-300">{{ dataService.getProductName(selectedTicket()!.linkedProductId) }}</p>
                    </div>
                    <div>
                      <p class="text-[8px] text-zinc-500 font-bold uppercase">SLA Estimado</p>
                      <p class="text-xs font-bold text-emerald-500">4 Horas Úteis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="h-full flex flex-col items-center justify-center text-center p-8">
            <div class="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center mb-6">
              <svg class="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <h3 class="text-xl font-black text-zinc-500 uppercase tracking-tighter">Nenhum Ticket Selecionado</h3>
            <p class="text-xs text-zinc-700 mt-2 max-w-xs uppercase font-bold tracking-widest">Selecione um chamado ao lado para iniciar a resolução.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 2px; }
  `]
})
export class SupportViewComponent {
  dataService = inject(DataService);
  selectedTicket = signal<Ticket | null>(null);

  updateStatus(newStatus: TicketStatus) {
    if (this.selectedTicket()) {
      this.dataService.updateTicketStatus(this.selectedTicket()!.id, newStatus);
    }
  }

  escalate() {
    if (this.selectedTicket()) {
      this.dataService.escalateTicketToDev(this.selectedTicket()!.id);
      // Refresh current ticket view
      const updated = this.dataService.tickets().find(t => t.id === this.selectedTicket()!.id);
      if (updated) this.selectedTicket.set({ ...updated });
    }
  }
}
