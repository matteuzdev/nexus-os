import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Client } from '../services/data.service';
import { NexusDrawerComponent } from './nexus-drawer.component';

@Component({
  selector: 'app-clients-view',
  standalone: true,
  imports: [CommonModule, FormsModule, NexusDrawerComponent],
  template: `
    <div class="flex flex-col h-full overflow-hidden">
      <header class="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h3 class="text-3xl font-black text-white uppercase tracking-tighter">Gestão de Clientes</h3>
          <p class="text-xs font-mono text-zinc-500 mt-1">Base de empresas parceiras e saúde do relacionamento.</p>
        </div>
        <button (click)="createNewClient()" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Novo Cliente
        </button>
      </header>

      <div class="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div class="overflow-x-auto flex-1 custom-scrollbar">
          <table class="w-full text-left text-sm">
            <thead class="bg-zinc-950/50 text-zinc-500 uppercase font-black text-[10px] tracking-widest sticky top-0 z-10">
              <tr>
                <th class="px-8 py-5">Empresa / Cliente</th>
                <th class="px-8 py-5">Status</th>
                <th class="px-8 py-5 text-center">Projetos</th>
                <th class="px-8 py-5 text-center">Tickets</th>
                <th class="px-8 py-5">Última Atividade</th>
                <th class="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-800/50">
              @for (client of dataService.clients(); track client.id) {
                <tr class="hover:bg-indigo-600/5 transition-colors group">
                  <td class="px-8 py-6">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-indigo-400 group-hover:border-indigo-500/50 transition-all">
                        {{ client.company.substring(0,1) }}
                      </div>
                      <div>
                        <p class="font-bold text-white leading-none mb-1">{{ client.company }}</p>
                        <p class="text-[10px] text-zinc-500 font-mono">{{ client.name }} • {{ client.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <span class="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                      [class.bg-emerald-500/10.text-emerald-400.border-emerald-500/20]="client.status === 'Ativo'"
                      [class.bg-amber-500/10.text-amber-400.border-amber-500/20]="client.status === 'Onboarding'"
                      [class.bg-zinc-800.text-zinc-500.border-zinc-700]="client.status === 'Inativo'">
                      {{ client.status }}
                    </span>
                  </td>
                  <td class="px-8 py-6 text-center">
                    <span class="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono font-bold text-xs">{{ client.totalProjects }}</span>
                  </td>
                  <td class="px-8 py-6 text-center">
                    <span [class]="client.openTickets > 0 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' : 'bg-zinc-800 text-zinc-500'" 
                      class="px-2 py-0.5 rounded font-mono font-bold text-xs">
                      {{ client.openTickets }}
                    </span>
                  </td>
                  <td class="px-8 py-6 text-xs text-zinc-400 font-mono">
                    {{ client.lastActivity | date:'shortDate' }}
                  </td>
                  <td class="px-8 py-6 text-right">
                    <div class="flex justify-end gap-2">
                      <button (click)="openDetail(client)" class="p-2 hover:bg-indigo-600/20 rounded-lg text-indigo-400 transition-all opacity-0 group-hover:opacity-100">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button (click)="deleteClient(client.id)" class="p-2 hover:bg-rose-500/20 rounded-lg text-rose-500 transition-all opacity-0 group-hover:opacity-100">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Detail Drawer -->
    <app-nexus-drawer 
      [isOpen]="isDrawerOpen()" 
      [type]="'client'" 
      [data]="selectedClient()" 
      (close)="isDrawerOpen.set(false)">
    </app-nexus-drawer>
  `
})
export class ClientsViewComponent {
  dataService = inject(DataService);
  
  isDrawerOpen = signal(false);
  selectedClient = signal<Client | null>(null);

  openDetail(client: Client) {
    this.selectedClient.set({ ...client });
    this.isDrawerOpen.set(true);
  }

  createNewClient() {
    const company = prompt('Nome da empresa:');
    if (!company) return;
    const name = prompt('Nome do contato principal:');
    const email = prompt('E-mail do cliente:');

    if (company && name && email) {
      this.dataService.addClient({
        company,
        name,
        email,
        status: 'Onboarding'
      });
    }
  }

  deleteClient(id: string) {
    if (confirm('Deseja realmente remover este cliente?')) {
      this.dataService.deleteClient(id);
    }
  }
}