import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Ticket, TicketStatus, TicketPriority } from '../services/data.service';
import { AiService } from '../services/ai.service';
import { NexusDrawerComponent } from './nexus-drawer.component';

@Component({
  selector: 'app-support-view',
  standalone: true,
  imports: [CommonModule, FormsModule, NexusDrawerComponent],
  template: `
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full">
      <!-- Tickets Sidebar/List -->
      <div class="xl:col-span-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 pb-8">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xl font-black text-white uppercase tracking-tighter">Inbox Suporte</h3>
          <span class="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{{ getFilteredTickets().length }}</span>
        </div>

        <!-- Support Filters -->
        <div class="space-y-3 mb-4">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input [(ngModel)]="searchTerm" placeholder="Buscar cliente..." class="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-8 pr-4 text-[10px] text-white focus:border-indigo-500 outline-none transition-all">
          </div>
          <div class="grid grid-cols-2 gap-2">
            <select [(ngModel)]="statusFilter" class="bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-[9px] font-black uppercase text-zinc-500 outline-none focus:border-indigo-500 appearance-none cursor-pointer">
              <option value="ALL">Todos Status</option>
              <option value="Aberto">Aberto</option>
              <option value="Em Análise">Em Análise</option>
              <option value="Aguardando Dev">Aguardando Dev</option>
              <option value="Resolvido">Resolvido</option>
            </select>
            <select [(ngModel)]="priorityFilter" class="bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-[9px] font-black uppercase text-zinc-500 outline-none focus:border-indigo-500 appearance-none cursor-pointer">
              <option value="ALL">Prioridades</option>
              <option value="Crítica">Crítica</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>
        </div>
        
        @for (ticket of getFilteredTickets(); track ticket.id) {
          <div (click)="selectedTicket.set(ticket)" 
            class="p-4 rounded-2xl border transition-all cursor-pointer group animate-in fade-in"
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
            <p class="text-[10px] text-zinc-500 mt-1 uppercase font-black tracking-tighter">{{ ticket.client }}</p>
          </div>
        }
      </div>

      <!-- Ticket Command Center -->
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

                @if (getSelectedProductBlueprint()) {
                  <div class="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-3xl space-y-3">
                    <h3 class="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Contexto do Sistema (Blueprint)
                    </h3>
                    <p class="text-xs text-indigo-200/70 font-mono leading-relaxed bg-zinc-950/50 p-4 rounded-xl border border-indigo-500/10">
                      {{ getSelectedProductBlueprint() }}
                    </p>
                  </div>
                }

                <!-- QA Analysis -->
                <div class="p-6 bg-emerald-600/5 border border-emerald-500/20 rounded-3xl space-y-4">
                  <div class="flex justify-between items-center">
                    <h3 class="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Análise Carla QA
                    </h3>
                    @if (isAnalyzing()) {
                       <span class="text-[8px] bg-emerald-500 text-black px-2 py-0.5 rounded font-black animate-pulse uppercase flex items-center gap-1">A Mente de Carla está Analisando...</span>
                    } @else {
                       <button (click)="generateQASteps()" [disabled]="!aiService.hasKey()" 
                          class="text-[8px] bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded font-black uppercase transition-all flex items-center gap-1">
                          Auto-Analisar com IA
                       </button>
                    }
                  </div>
                  <textarea [(ngModel)]="selectedTicket()!.reproductionSteps" 
                    placeholder="Notas técnicas geradas pela Carla..."
                    class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 outline-none focus:border-emerald-500 resize-none font-mono min-h-[100px]"></textarea>
                </div>

                <!-- Orion Integration -->
                <div class="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-3xl space-y-4">
                  <h3 class="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">Orion Dev Engine</h3>
                  @if (selectedTicket()!.linkedTaskId) {
                    <div class="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex justify-between items-center">
                       <span class="text-xs font-bold text-white">Tarefa #{{ selectedTicket()!.linkedTaskId }} em Sprint</span>
                       <span class="text-[8px] font-black uppercase text-indigo-400">Ver Board</span>
                    </div>
                  } @else {
                    <button (click)="escalate()" [disabled]="!selectedTicket()!.reproductionSteps" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20">Escalar para Engenharia</button>
                  }
                </div>
              </div>

              <!-- Metadata Sidebar -->
              <div class="space-y-6">
                <div class="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-xl">
                  <h4 class="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6">Metadados</h4>
                  <div class="space-y-6">
                    <div>
                      <p class="text-[8px] text-zinc-500 font-black uppercase mb-1">Projeto Afetado</p>
                      <p class="text-sm font-bold text-white">{{ dataService.getProjectName(selectedTicket()!.linkedProjectId) }}</p>
                    </div>
                    <div>
                      <p class="text-[8px] text-zinc-500 font-black uppercase mb-1">SLA de Resolução</p>
                      <p class="text-xs font-bold text-emerald-500">Ativo ({{ selectedTicket()!.slaHours }}h)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="h-full flex flex-col items-center justify-center text-center p-8">
            <h3 class="text-2xl font-black text-white uppercase tracking-tighter">Nexus Support</h3>
            <p class="text-[10px] text-zinc-600 mt-4 max-w-xs font-black uppercase tracking-widest leading-relaxed">Aguardando seleção de ticket.</p>
          </div>
        }
      </div>
    </div>
    
    <app-nexus-drawer [isOpen]="isDrawerOpen()" [type]="'ticket'" [data]="selectedTicket()" (close)="isDrawerOpen.set(false)"></app-nexus-drawer>
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

  searchTerm = '';
  statusFilter = 'ALL';
  priorityFilter = 'ALL';

  constructor() {
    effect(async () => {
      const ticket = this.selectedTicket();
      if (ticket && !ticket.reproductionSteps && this.aiService.hasKey()) {
        await this.generateQASteps();
      }
    });
  }

  updateStatus(newStatus: TicketStatus) {
    if (this.selectedTicket()) this.dataService.updateTicketStatus(this.selectedTicket()!.id, newStatus);
  }

  getFilteredTickets(): Ticket[] {
    return this.dataService.tickets().filter(t => {
      const matchSearch = t.client.toLowerCase().includes(this.searchTerm.toLowerCase()) || t.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchStatus = this.statusFilter === 'ALL' || t.status === this.statusFilter;
      const matchPriority = this.priorityFilter === 'ALL' || t.priority === this.priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }

  getSelectedProductBlueprint(): string {
    if (!this.selectedTicket()) return '';
    return this.dataService.projects().find(p => p.id === this.selectedTicket()!.linkedProjectId)?.blueprint || '';
  }

  async generateQASteps() {
    if (!this.selectedTicket()) return;
    this.isAnalyzing.set(true);
    const steps = await this.aiService.chatWithAgent('carla', `Analise este ticket: ${this.selectedTicket()!.description}`, '', this.getSelectedProductBlueprint());
    this.selectedTicket()!.reproductionSteps = steps;
    this.isAnalyzing.set(false);
  }

  escalate() {
    if (this.selectedTicket()) this.dataService.escalateTicketToDev(this.selectedTicket()!.id);
  }
}