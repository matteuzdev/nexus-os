import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Lead, LeadStatus } from '../services/data.service';
import { NexusDrawerComponent } from './nexus-drawer.component';

@Component({
  selector: 'app-sales-view',
  standalone: true,
  imports: [CommonModule, NexusDrawerComponent],
  template: `
    <div class="flex flex-col h-full overflow-hidden">
      <!-- Sales Stats & Actions -->
      <div class="flex items-center justify-between mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 mr-8">
          <div class="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
            <p class="text-xs text-zinc-500 uppercase font-bold mb-1">Pipeline Total</p>
            <p class="text-2xl font-bold text-white">R$ {{ dataService.pipelineValue() | number:'1.2-2' }}</p>
          </div>
          <div class="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
            <p class="text-xs text-zinc-500 uppercase font-bold mb-1">Leads Ativos</p>
            <p class="text-2xl font-bold text-white">{{ activeLeadsCount() }}</p>
          </div>
          <div class="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
            <p class="text-xs text-zinc-500 uppercase font-bold mb-1">Taxa de Conversão</p>
            <p class="text-2xl font-bold text-emerald-500">24%</p>
          </div>
          <div class="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
            <p class="text-xs text-zinc-500 uppercase font-bold mb-1">Ticket Médio</p>
            <p class="text-2xl font-bold text-white">R$ 15.400</p>
          </div>
        </div>

        <button (click)="createNewLead()" class="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Novo Lead
        </button>
      </div>

      <!-- Funnel Board -->
      <div class="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div class="flex gap-4 h-full min-w-max">
          @for (column of funnelColumns; track column.status) {
            <div class="w-80 flex flex-col bg-zinc-900/30 rounded-xl border border-zinc-800/50">
              <!-- Column Header -->
              <div class="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 rounded-t-xl">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full" [style.backgroundColor]="column.color"></div>
                  <h3 class="font-bold text-sm text-zinc-200 uppercase tracking-wider">{{ column.label }}</h3>
                </div>
                <span class="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full font-mono">
                  {{ getLeadsByStatus(column.status).length }}
                </span>
              </div>

              <!-- Column Leads -->
              <div class="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                @for (lead of getLeadsByStatus(column.status); track lead.id) {
                  <div (click)="openDetail(lead)" class="group p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-indigo-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md">
                    <div class="flex justify-between items-start mb-2">
                      <h4 class="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{{ lead.company }}</h4>
                      <span class="text-[10px] text-zinc-500 font-mono">{{ lead.source }}</span>
                    </div>
                    <p class="text-xs text-zinc-400 mb-4">{{ lead.contact }}</p>
                    
                    <div class="flex items-center justify-between border-t border-zinc-800/50 pt-3">
                      <span class="text-sm font-bold text-emerald-400">R$ {{ lead.value | number:'1.0-0' }}</span>
                      
                      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" (click)="$event.stopPropagation()">
                         @if (column.status !== 'Lead') {
                           <button (click)="moveLeft(lead)" class="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white">
                             <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                           </button>
                         }
                         @if (column.status !== 'Fechado' && column.status !== 'Perdido') {
                           <button (click)="moveRight(lead)" class="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white">
                             <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                           </button>
                         }
                      </div>
                    </div>
                  </div>
                }
                
                @if (getLeadsByStatus(column.status).length === 0) {
                  <div class="h-24 border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 text-xs italic">
                    Vazio
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Detail Drawer -->
    <app-nexus-drawer 
      [isOpen]="isDrawerOpen()" 
      [type]="'lead'" 
      [data]="selectedLead()" 
      (close)="isDrawerOpen.set(false)">
    </app-nexus-drawer>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
  `]
})
export class SalesViewComponent {
  dataService = inject(DataService);

  isDrawerOpen = signal(false);
  selectedLead = signal<Lead | null>(null);

  funnelColumns: { status: LeadStatus, label: string, color: string }[] = [
    { status: 'Lead', label: 'Prospecção', color: '#94a3b8' },
    { status: 'Qualificado', label: 'Qualificação', color: '#6366f1' },
    { status: 'Proposta', label: 'Proposta Enviada', color: '#a855f7' },
    { status: 'Negociação', label: 'Negociação', color: '#eab308' },
    { status: 'Fechado', label: 'Ganhamos!', color: '#10b981' },
    { status: 'Perdido', label: 'Perdido', color: '#f43f5e' }
  ];

  activeLeadsCount = computed(() => 
    this.dataService.leads().filter(l => l.status !== 'Fechado' && l.status !== 'Perdido').length
  );

  getLeadsByStatus(status: LeadStatus) {
    return this.dataService.leads().filter(l => l.status === status);
  }

  openDetail(lead: Lead) {
    this.selectedLead.set({ ...lead });
    this.isDrawerOpen.set(true);
  }

  createNewLead() {
    const company = prompt('Nome da empresa:');
    if (company) {
      this.dataService.addLead({
        company,
        contact: 'Novo Contato',
        value: 0,
        status: 'Lead',
        source: 'Manual',
        investigation: {
          painPoints: '',
          techStack: '',
          budgetRange: '',
          decisionMaker: '',
          notes: ''
        }
      });
    }
  }

  moveLeft(lead: Lead) {
    const currentIndex = this.funnelColumns.findIndex(c => c.status === lead.status);
    if (currentIndex > 0) {
      this.dataService.moveLead(lead.id, this.funnelColumns[currentIndex - 1].status);
    }
  }

  moveRight(lead: Lead) {
    const currentIndex = this.funnelColumns.findIndex(c => c.status === lead.status);
    if (currentIndex < this.funnelColumns.length - 1) {
      this.dataService.moveLead(lead.id, this.funnelColumns[currentIndex + 1].status);
    }
  }
}
