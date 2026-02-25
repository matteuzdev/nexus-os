import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Ticket, TicketPriority, TicketStatus } from '../services/data.service';

@Component({
  selector: 'app-support-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex h-full gap-6">
      
      <!-- LEFT: Ticket List (Master) -->
      <div class="w-96 flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shrink-0">
        <div class="p-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
          <h2 class="font-bold text-white">Tickets</h2>
          <button (click)="openCreateModal()" class="w-8 h-8 rounded bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
        
        <!-- Filters (Simple) -->
        <div class="p-2 border-b border-zinc-800 flex gap-2">
          <button class="flex-1 text-xs py-1.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700">Todos</button>
          <button class="flex-1 text-xs py-1.5 rounded bg-transparent border border-zinc-800 text-zinc-500 hover:text-zinc-300">Abertos</button>
        </div>

        <div class="overflow-y-auto flex-1 p-2 custom-scrollbar">
          @for (ticket of dataService.tickets(); track ticket.id) {
            <div 
              (click)="selectTicket(ticket)"
              class="group p-4 mb-2 rounded-lg border cursor-pointer transition-all relative"
              [class]="selectedTicket()?.id === ticket.id 
                ? 'bg-indigo-900/10 border-indigo-500/50 shadow-inner' 
                : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600'"
            >
              <!-- Ticket Priority Line -->
              <div class="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" [ngClass]="getPriorityColor(ticket.priority)"></div>

              <div class="pl-2">
                <div class="flex justify-between items-start mb-1">
                  <span class="text-[10px] font-mono text-zinc-500">{{ ticket.id }}</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded" [ngClass]="getStatusClass(ticket.status)">{{ ticket.status }}</span>
                </div>
                <h4 class="text-sm font-medium text-zinc-200 line-clamp-2 mb-2">{{ ticket.title }}</h4>
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[8px] font-bold text-zinc-400">
                    {{ ticket.client.substring(0,2).toUpperCase() }}
                  </div>
                  <span class="text-xs text-zinc-400 truncate">{{ ticket.client }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- RIGHT: Detail View (Detail) -->
      <div class="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col relative">
        @if (selectedTicket(); as ticket) {
          <!-- Toolbar -->
          <div class="h-14 border-b border-zinc-800 bg-zinc-950/50 flex items-center justify-between px-6">
            <div class="flex items-center gap-2 text-zinc-500 text-sm">
              <span class="font-mono">{{ ticket.id }}</span>
              <span>/</span>
              <span>{{ dataService.getProductName(ticket.linkedProductId) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button (click)="deleteTicket(ticket.id)" class="p-2 text-zinc-500 hover:text-red-400 transition-colors" title="Excluir">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
              <button class="p-2 text-zinc-500 hover:text-white transition-colors" title="Fechar" (click)="selectedTicket.set(null)">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div class="max-w-3xl mx-auto space-y-8">
              
              <!-- Header -->
              <div>
                <h1 class="text-2xl font-bold text-white mb-4">{{ ticket.title }}</h1>
                <div class="flex flex-wrap gap-4">
                  <!-- Status Dropdown Simulation -->
                  <div class="relative group">
                    <label class="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Status</label>
                    <select 
                      [ngModel]="ticket.status" 
                      (ngModelChange)="updateStatus(ticket.id, $event)"
                      class="bg-zinc-950 border border-zinc-700 text-zinc-300 text-sm rounded px-2 py-1.5 focus:border-indigo-500 outline-none hover:border-zinc-500 transition-colors appearance-none pr-8 cursor-pointer"
                    >
                      <option value="Aberto">Aberto</option>
                      <option value="Em Análise">Em Análise</option>
                      <option value="Aguardando Dev">Aguardando Dev</option>
                      <option value="Resolvido">Resolvido</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Prioridade</label>
                    <span class="flex items-center gap-2 text-sm text-zinc-300 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded">
                      <div class="w-2 h-2 rounded-full" [ngClass]="getPriorityColor(ticket.priority)"></div>
                      {{ ticket.priority }}
                    </span>
                  </div>

                  <div>
                    <label class="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Produto</label>
                    <span class="text-sm text-zinc-300 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded flex items-center gap-2">
                       {{ dataService.getProductName(ticket.linkedProductId) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Interconnection Panel -->
              <div class="p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg flex items-center justify-between">
                <div>
                   <h3 class="text-sm font-semibold text-zinc-300">Desenvolvimento</h3>
                   @if (ticket.linkedTaskId) {
                     <p class="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                       <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                       Vinculado à Tarefa #{{ticket.linkedTaskId}}
                     </p>
                   } @else {
                     <p class="text-xs text-zinc-500 mt-1">Nenhuma tarefa de desenvolvimento vinculada.</p>
                   }
                </div>
                @if (!ticket.linkedTaskId) {
                  <button (click)="escalate(ticket.id)" class="text-xs px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors font-medium">
                    Enviar para Dev
                  </button>
                }
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-bold text-zinc-400 mb-2">Descrição</label>
                <div class="p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-sm leading-relaxed whitespace-pre-line min-h-[150px]">
                  {{ ticket.description }}
                </div>
              </div>

              <!-- Client Info -->
              <div>
                <label class="block text-sm font-bold text-zinc-400 mb-2">Cliente</label>
                <div class="flex items-center gap-3">
                   <div class="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-500">
                     {{ ticket.client.substring(0,1) }}
                   </div>
                   <div>
                     <p class="text-zinc-200 font-medium">{{ ticket.client }}</p>
                     <p class="text-zinc-500 text-xs">Cliente Corporativo</p>
                   </div>
                </div>
              </div>

            </div>
          </div>

        } @else {
          <div class="flex-1 flex flex-col items-center justify-center text-zinc-600">
            <svg class="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-sm">Selecione um ticket para ver detalhes</p>
          </div>
        }
      </div>
    </div>

    <!-- Create Modal -->
    @if (isCreateModalOpen()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
          <div class="p-6 border-b border-zinc-800">
            <h3 class="text-lg font-bold text-white">Novo Ticket</h3>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-zinc-500 uppercase mb-1">Título</label>
              <input [(ngModel)]="newTicket.title" class="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white focus:border-indigo-500 outline-none transition-colors" placeholder="Resumo do problema">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase mb-1">Cliente</label>
                <input [(ngModel)]="newTicket.client" class="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white focus:border-indigo-500 outline-none" placeholder="Nome do cliente">
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase mb-1">Prioridade</label>
                <select [(ngModel)]="newTicket.priority" class="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white focus:border-indigo-500 outline-none">
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                  <option value="Crítica">Crítica</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-zinc-500 uppercase mb-1">Produto Vinculado</label>
              <select [(ngModel)]="newTicket.linkedProductId" class="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white focus:border-indigo-500 outline-none">
                @for (prod of dataService.products(); track prod.id) {
                  <option [value]="prod.id">{{ prod.name }}</option>
                }
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-zinc-500 uppercase mb-1">Descrição</label>
              <textarea [(ngModel)]="newTicket.description" rows="4" class="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white focus:border-indigo-500 outline-none resize-none" placeholder="Detalhes do chamado..."></textarea>
            </div>
          </div>
          <div class="p-4 border-t border-zinc-800 flex justify-end gap-3">
            <button (click)="isCreateModalOpen.set(false)" class="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancelar</button>
            <button (click)="createTicket()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-medium transition-colors">Criar Ticket</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 3px; }
  `]
})
export class SupportViewComponent {
  dataService = inject(DataService);
  
  selectedTicket = signal<Ticket | null>(null);
  isCreateModalOpen = signal(false);

  // Form State
  newTicket: any = {
    title: '',
    client: '',
    priority: 'Média',
    linkedProductId: '',
    description: ''
  };

  selectTicket(ticket: Ticket) {
    this.selectedTicket.set(ticket);
  }

  getPriorityColor(p: string): string {
    switch (p) {
      case 'Alta': return 'bg-orange-500';
      case 'Crítica': return 'bg-red-500';
      case 'Baixa': return 'bg-blue-500';
      default: return 'bg-yellow-500';
    }
  }

  getStatusClass(s: string): string {
    switch(s) {
      case 'Aberto': return 'text-zinc-400 bg-zinc-800';
      case 'Resolvido': return 'text-emerald-400 bg-emerald-900/30 border border-emerald-900';
      case 'Aguardando Dev': return 'text-indigo-400 bg-indigo-900/30 border border-indigo-900';
      default: return 'text-zinc-300 bg-zinc-800';
    }
  }

  updateStatus(id: string, newStatus: TicketStatus) {
    this.dataService.updateTicketStatus(id, newStatus);
    // Refresh local signal if needed or rely on DataService reactivity
    // Since selectedTicket is a copy or ref? It's a ref from the signal loop, but let's re-set to be safe if it's strictly immutable upstream
    const updated = this.dataService.tickets().find(t => t.id === id);
    if (updated) this.selectedTicket.set(updated);
  }

  deleteTicket(id: string) {
    if(confirm('Tem certeza que deseja excluir este ticket?')) {
      this.dataService.deleteTicket(id);
      this.selectedTicket.set(null);
    }
  }

  escalate(id: string) {
    this.dataService.escalateTicketToDev(id);
    const updated = this.dataService.tickets().find(t => t.id === id);
    if (updated) this.selectedTicket.set(updated);
  }

  openCreateModal() {
    this.newTicket = { title: '', client: '', priority: 'Média', linkedProductId: this.dataService.products()[0]?.id, description: '' };
    this.isCreateModalOpen.set(true);
  }

  createTicket() {
    if (!this.newTicket.title || !this.newTicket.client) return;
    
    this.dataService.addTicket({
      title: this.newTicket.title,
      client: this.newTicket.client,
      description: this.newTicket.description,
      priority: this.newTicket.priority,
      linkedProductId: this.newTicket.linkedProductId
    });
    this.isCreateModalOpen.set(false);
  }
}