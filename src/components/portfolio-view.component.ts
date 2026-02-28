import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, LifecycleStage } from '../services/data.service';

@Component({
  selector: 'app-portfolio-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      <div class="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
        <div>
          <h2 class="text-xl font-bold text-white">Portfólio de Serviços</h2>
          <p class="text-zinc-400 text-sm mt-1">Catálogo estratégico da Konig Systems.</p>
        </div>
        <button (click)="addProduct()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
          Novo Serviço
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-zinc-400">
          <thead class="bg-zinc-950 text-zinc-500 uppercase font-medium text-xs">
            <tr>
              <th class="px-6 py-4">Produto/Serviço</th>
              <th class="px-6 py-4">Estágio</th>
              <th class="px-6 py-4">Versão</th>
              <th class="px-6 py-4">Status Geral</th>
              <th class="px-6 py-4">Próximo Passo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800">
            @for (product of dataService.products(); track product.id) {
              <tr class="hover:bg-zinc-800/30 transition-colors group">
                <td class="px-6 py-4 font-medium text-zinc-200">
                  {{ product.name }}
                  <div class="text-[10px] text-zinc-600 font-mono">{{ product.id }}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 rounded text-xs font-bold border" [ngClass]="getStageClass(product.stage)">
                    {{ product.stage }}
                  </span>
                </td>
                <td class="px-6 py-4 font-mono">{{ product.version }}</td>
                <td class="px-6 py-4">
                  <div class="flex gap-3">
                    <div class="flex items-center gap-1.5" title="Tarefas em Aberto">
                      <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <span class="text-zinc-300 font-mono">{{ getTaskCount(product.id) }}</span>
                    </div>
                    <div class="flex items-center gap-1.5" title="Tickets Ativos">
                       <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                       <span class="text-zinc-300 font-mono">{{ getTicketCount(product.id) }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-zinc-300 flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                  {{ product.nextAction }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class PortfolioViewComponent {
  dataService = inject(DataService);

  getStageClass(stage: LifecycleStage): string {
    switch(stage) {
      case 'Ideação': return 'bg-zinc-800 text-zinc-400 border-zinc-700';
      case 'Validação': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
      case 'Desenvolvimento': return 'bg-indigo-900/30 text-indigo-400 border-indigo-500/30';
      case 'Produção': return 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30';
      case 'Manutenção': return 'bg-orange-900/30 text-orange-400 border-orange-500/30';
      default: return 'bg-zinc-800 text-zinc-400';
    }
  }

  getTaskCount(productId: string): number {
    // Agora que usamos Projetos, filtramos as tasks cujos projetos pertencem a este tipo de produto
    // Ou para simplificar o catálogo, mantemos a contagem baseada na nova propriedade do projeto
    return this.dataService.tasks().filter(t => t.linkedProjectId === productId && t.status !== 'Concluído').length;
  }

  getTicketCount(productId: string): number {
    return this.dataService.tickets().filter(t => t.linkedProjectId === productId && t.status !== 'Resolvido').length;
  }

  addProduct() {
    const name = prompt('Nome do novo serviço:');
    if (name) {
      this.dataService.addProduct({
        name,
        stage: 'Ideação',
        version: 'v0.1.0',
        revenue: 0,
        nextAction: 'Definir escopo inicial'
      });
    }
  }
}