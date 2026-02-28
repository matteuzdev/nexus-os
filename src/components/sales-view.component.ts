import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Lead, LeadStatus } from '../services/data.service';
import { NexusDrawerComponent } from './nexus-drawer.component';
import { NexusModalComponent } from './nexus-modal.component';

@Component({
  selector: 'app-sales-view',
  standalone: true,
  imports: [CommonModule, FormsModule, NexusDrawerComponent, NexusModalComponent],
  template: `
    <div class="flex flex-col h-full overflow-hidden">
      <!-- CRM Header -->
      <div class="flex items-center justify-between mb-8 shrink-0 px-2">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:gap-8">
          <div>
            <h3 class="text-3xl font-black text-white uppercase tracking-tighter">CRM & Growth</h3>
            <p class="text-xs font-mono text-zinc-500 mt-1">Pipeline: <span class="text-emerald-400 font-bold">{{ dataService.pipelineValue() | currency:'BRL' }}</span></p>
          </div>
          
          <!-- Advanced Filters -->
          <div class="flex items-center gap-3">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input [(ngModel)]="searchTerm" placeholder="Buscar empresa..." class="bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:border-indigo-500 outline-none w-48 transition-all">
            </div>
            <select [(ngModel)]="sourceFilter" class="bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-[10px] font-black uppercase text-zinc-400 outline-none focus:border-indigo-500 appearance-none cursor-pointer">
              <option value="ALL">Todas Origens</option>
              <option value="Ads">Ads</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Manual">Manual</option>
              <option value="Indicador">Indicação</option>
            </select>
          </div>
        </div>
        <button (click)="isModalOpen.set(true)" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Novo Lead
        </button>
      </div>

      <!-- Funnel Container -->
      <div class="flex-1 overflow-x-auto pb-6 custom-scrollbar flex gap-6 items-start">
        @for (col of funnelColumns; track col.status) {
          <div class="w-80 shrink-0 flex flex-col max-h-full bg-zinc-900/30 border border-zinc-800/50 rounded-[2rem] overflow-hidden group/column">
            <!-- Column Header -->
            <div class="p-5 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center sticky top-0 z-10">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" [class.bg-indigo-500]="true"></div>
                <span class="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400">{{ col.status }}</span>
              </div>
              <span class="bg-zinc-800 text-zinc-500 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                {{ getLeadsByStatus(col.status).length }}
              </span>
            </div>

            <!-- Leads List -->
            <div class="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar min-h-[150px]">
              @for (lead of getLeadsByStatus(col.status); track lead.id) {
                <div (click)="openDetail(lead)" 
                  class="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/5 cursor-pointer transition-all group relative overflow-hidden animate-in fade-in zoom-in-95">
                  
                  <div class="absolute bottom-0 left-0 h-1 bg-indigo-600/20 w-full">
                    <div class="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" [style.width.%]="getLeadProgress(lead.status)"></div>
                  </div>

                  <div class="flex justify-between items-start mb-4">
                    <h5 class="text-sm text-white font-bold leading-tight group-hover:text-indigo-400 transition-colors">{{ lead.company }}</h5>
                    <span class="text-[10px] font-black text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                      {{ lead.value | currency:'BRL':'symbol':'1.0-0' }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[8px] font-bold text-zinc-500">
                        {{ lead.contact.substring(0,1) }}
                      </div>
                      <span class="text-[10px] text-zinc-500 font-medium">{{ lead.contact }}</span>
                    </div>
                    <div class="flex gap-1.5">
                       <div class="w-1.5 h-1.5 rounded-full bg-zinc-700" [class.bg-emerald-500]="lead.source === 'Ads'"></div>
                       <div class="w-1.5 h-1.5 rounded-full bg-indigo-500" [class.bg-indigo-500]="lead.source === 'Indicador'"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Detail Drawer -->
    <app-nexus-drawer 
      [isOpen]="isDrawerOpen()" 
      [type]="'lead'" 
      [data]="selectedLead()" 
      (close)="isDrawerOpen.set(false)">
    </app-nexus-drawer>

    <!-- New Lead Modal -->
    <app-nexus-modal
      [isOpen]="isModalOpen()"
      title="Capturar Novo Lead"
      subtitle="Entrada de pipeline estratégico"
      confirmLabel="Adicionar ao Funil"
      (close)="isModalOpen.set(false)"
      (confirm)="saveNewLead()">
      
      <div class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nome da Empresa</label>
            <input [(ngModel)]="newLead.company" placeholder="Ex: Konig Systems" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-all">
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Valor Estimado (R$)</label>
            <input type="number" [(ngModel)]="newLead.value" placeholder="5000" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-emerald-400 font-bold focus:border-indigo-500 outline-none transition-all">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Contato Principal</label>
            <input [(ngModel)]="newLead.contact" placeholder="Nome do decisor" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-all">
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">E-mail</label>
            <input [(ngModel)]="newLead.email" placeholder="email@empresa.com" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-all">
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Origem do Lead</label>
          <select [(ngModel)]="newLead.source" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-all appearance-none">
            <option value="Ads">Ads (Google/Meta)</option>
            <option value="LinkedIn">LinkedIn Outreach</option>
            <option value="Indicador">Indicação</option>
            <option value="Manual">Prospecção Ativa</option>
          </select>
        </div>
      </div>
    </app-nexus-modal>
  `
})
export class SalesViewComponent {
  dataService = inject(DataService);
  
  isDrawerOpen = signal(false);
  isModalOpen = signal(false);
  selectedLead = signal<Lead | null>(null);

  searchTerm = '';
  sourceFilter = 'ALL';

  newLead = {
    company: '',
    contact: '',
    email: '',
    value: 0,
    source: 'Manual' as any
  };

  funnelColumns: { status: LeadStatus }[] = [
    { status: 'Lead' },
    { status: 'Qualificado' },
    { status: 'Proposta' },
    { status: 'Negociação' },
    { status: 'Fechado' }
  ];

  getLeadsByStatus(status: LeadStatus): Lead[] {
    return this.dataService.leads().filter(l => {
      const matchStatus = l.status === status;
      const matchSearch = l.company.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchSource = this.sourceFilter === 'ALL' || l.source === this.sourceFilter;
      return matchStatus && matchSearch && matchSource;
    });
  }

  getLeadProgress(status: LeadStatus): number {
    const steps: LeadStatus[] = ['Lead', 'Qualificado', 'Proposta', 'Negociação', 'Fechado'];
    return ((steps.indexOf(status) + 1) / steps.length) * 100;
  }

  openDetail(lead: Lead) {
    this.selectedLead.set({ ...lead });
    this.isDrawerOpen.set(true);
  }

  saveNewLead() {
    if (!this.newLead.company) return;
    this.dataService.addLead({
      ...this.newLead,
      phone: '',
      status: 'Lead',
      investigation: {
        industry: '', companySize: '1-10', painPoints: '', techStack: '', budgetRange: '', decisionMaker: '', notes: ''
      }
    });
    this.isModalOpen.set(false);
    this.newLead = { company: '', contact: '', email: '', value: 0, source: 'Manual' };
  }
}