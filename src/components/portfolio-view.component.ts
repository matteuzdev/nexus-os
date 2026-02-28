import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, LifecycleStage } from '../services/data.service';
import { NexusModalComponent } from './nexus-modal.component';

@Component({
  selector: 'app-portfolio-view',
  standalone: true,
  imports: [CommonModule, FormsModule, NexusModalComponent],
  template: `
    <div class="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      <div class="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 flex-wrap gap-4">
        <div class="flex items-center gap-8">
          <div>
            <h2 class="text-xl font-bold text-white uppercase tracking-tighter">Catálogo de Serviços</h2>
            <p class="text-zinc-400 text-xs mt-1 uppercase tracking-widest font-black">Orquestração de Portfólio Konig Systems</p>
          </div>
          <div class="relative hidden md:block">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input [(ngModel)]="searchTerm" placeholder="Filtrar catálogo..." class="bg-zinc-950 border border-zinc-800 rounded-xl py-2 pl-8 pr-4 text-[10px] text-white focus:border-indigo-500 outline-none w-48 transition-all">
          </div>
        </div>
        <button (click)="isModalOpen.set(true)" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20">
          Novo Serviço
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-zinc-400">
          <thead class="bg-zinc-950 text-zinc-500 uppercase font-black text-[10px] tracking-widest">
            <tr>
              <th class="px-8 py-5">Serviço/Produto</th>
              <th class="px-8 py-5">Estágio</th>
              <th class="px-8 py-5">Versão</th>
              <th class="px-8 py-5">Próximo Passo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800">
            @for (product of filteredProducts(); track product.id) {
              <tr class="hover:bg-indigo-600/5 transition-colors group animate-in fade-in">
                <td class="px-8 py-6">
                  <div class="flex flex-col">
                    <span class="font-bold text-white group-hover:text-indigo-400 transition-colors">{{ product.name }}</span>
                    <span class="text-[8px] text-zinc-600 font-mono mt-1">ID: {{ product.id }}</span>
                  </div>
                </td>
                <td class="px-8 py-6">
                  <span class="px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-tighter border" [ngClass]="getStageClass(product.stage)">
                    {{ product.stage }}
                  </span>
                </td>
                <td class="px-8 py-6 font-mono text-xs">{{ product.version }}</td>
                <td class="px-8 py-6">
                  <div class="flex items-center gap-2 text-zinc-300 italic text-xs">
                    <div class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    {{ product.nextAction }}
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- New Product Modal -->
    <app-nexus-modal
      [isOpen]="isModalOpen()"
      title="Novo Serviço no Portfólio"
      subtitle="Definição de oferta estratégica"
      confirmLabel="Cadastrar Serviço"
      (close)="isModalOpen.set(false)"
      (confirm)="saveNewProduct()">
      
      <div class="space-y-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nome do Serviço</label>
          <input [(ngModel)]="newProduct.name" placeholder="Ex: Agente de IA para Vendas" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none">
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estágio Inicial</label>
            <select [(ngModel)]="newProduct.stage" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none">
              <option value="Ideação">Ideação</option>
              <option value="Validação">Validação</option>
              <option value="Desenvolvimento">Desenvolvimento</option>
              <option value="Produção">Produção</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Versão</label>
            <input [(ngModel)]="newProduct.version" placeholder="v1.0.0" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none">
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Próxima Ação Estratégica</label>
          <input [(ngModel)]="newProduct.nextAction" placeholder="Ex: Definir arquitetura de prompts" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none">
        </div>
      </div>
    </app-nexus-modal>
  `
})
export class PortfolioViewComponent {
  dataService = inject(DataService);
  isModalOpen = signal(false);
  searchTerm = '';

  filteredProducts = computed(() => {
    return this.dataService.products().filter(p => 
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  });

  newProduct = { name: '', stage: 'Ideação' as LifecycleStage, version: 'v0.1.0', nextAction: '' };

  getStageClass(stage: LifecycleStage): string {
    switch(stage) {
      case 'Ideação': return 'bg-zinc-800 text-zinc-400 border-zinc-700';
      case 'Validação': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
      case 'Desenvolvimento': return 'bg-indigo-900/30 text-indigo-400 border-indigo-500/30';
      case 'Produção': return 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30';
      default: return 'bg-zinc-800 text-zinc-400';
    }
  }

  saveNewProduct() {
    if (!this.newProduct.name) return;
    this.dataService.addProduct({ ...this.newProduct, revenue: 0 });
    this.isModalOpen.set(false);
    this.newProduct = { name: '', stage: 'Ideação', version: 'v0.1.0', nextAction: '' };
  }
}