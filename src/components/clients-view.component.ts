import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Client } from '../services/data.service';
import { NexusDrawerComponent } from './nexus-drawer.component';
import { NexusModalComponent } from './nexus-modal.component';

@Component({
  selector: 'app-clients-view',
  standalone: true,
  imports: [CommonModule, FormsModule, NexusDrawerComponent, NexusModalComponent],
  template: `
    <div class="flex flex-col h-full overflow-hidden">
      <header class="flex items-center justify-between mb-8 shrink-0 px-2 flex-wrap gap-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:gap-8 flex-1">
          <div>
            <h3 class="text-3xl font-black text-white uppercase tracking-tighter">Gestão de Clientes</h3>
            <p class="text-xs font-mono text-zinc-500 mt-1">Base de empresas parceiras e saúde do relacionamento.</p>
          </div>
          
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input [(ngModel)]="searchTerm" placeholder="Buscar empresa..." class="bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:border-indigo-500 outline-none w-64 transition-all">
          </div>
        </div>
        <button (click)="openNewClientModal()" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
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
              @for (client of filteredClients(); track client.id) {
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
                    <span class="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono font-bold text-xs">{{ getClientProjects(client.id).length }}</span>
                  </td>
                  <td class="px-8 py-6 text-center">
                    <span class="px-2 py-0.5 rounded font-mono font-bold text-xs bg-zinc-800 text-zinc-500">
                      {{ client.openTickets || 0 }}
                    </span>
                  </td>
                  <td class="px-8 py-6 text-xs text-zinc-400 font-mono">
                    {{ client.lastActivity | date:'shortDate' }}
                  </td>
                  <td class="px-8 py-6 text-right">
                    <div class="flex justify-end gap-2">
                      <button (click)="openDetail(client)" title="Editar Cliente" class="p-2 hover:bg-indigo-600/20 rounded-lg text-indigo-400 transition-all opacity-0 group-hover:opacity-100">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button (click)="openNewProjectModal(client.id)" title="Novo Projeto" class="p-2 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-all opacity-0 group-hover:opacity-100">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                @if (getClientProjects(client.id).length > 0) {
                  <tr class="bg-zinc-950/30">
                    <td colspan="6" class="px-8 py-4">
                      <div class="flex items-center gap-4 flex-wrap">
                        <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Projetos:</span>
                        @for (proj of getClientProjects(client.id); track proj.id) {
                          <button (click)="openProject(proj)" class="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-indigo-500 rounded-lg text-xs text-zinc-300 font-medium transition-all flex items-center gap-2">
                            <div class="w-1.5 h-1.5 rounded-full" 
                              [class.bg-zinc-600]="proj.status === 'Planejamento'"
                              [class.bg-indigo-500]="proj.status === 'Em Desenvolvimento'"
                              [class.bg-emerald-500]="proj.status === 'Em Produção'"></div>
                            {{ proj.name }}
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Detail Drawer -->
    <app-nexus-drawer [isOpen]="isDrawerOpen()" [type]="drawerType()" [data]="selectedData()" (close)="isDrawerOpen.set(false)"></app-nexus-drawer>

    <!-- New Client Modal -->
    <app-nexus-modal
      [isOpen]="isClientModalOpen()"
      title="Novo Cliente Parceiro"
      subtitle="Entrada de nova empresa no ecossistema"
      confirmLabel="Cadastrar Empresa"
      (close)="isClientModalOpen.set(false)"
      (confirm)="saveNewClient()">
      <div class="space-y-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nome da Empresa</label>
          <input [(ngModel)]="newClient.company" placeholder="Ex: Konig Systems" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none">
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Contato Principal</label>
            <input [(ngModel)]="newClient.name" placeholder="Nome do cliente" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none">
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">E-mail</label>
            <input [(ngModel)]="newClient.email" placeholder="cliente@email.com" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none">
          </div>
        </div>
      </div>
    </app-nexus-modal>

    <!-- New Project Modal -->
    <app-nexus-modal
      [isOpen]="isProjectModalOpen()"
      title="Novo Projeto Técnico"
      subtitle="Vinculação de blueprint e URL"
      confirmLabel="Iniciar Projeto"
      (close)="isProjectModalOpen.set(false)"
      (confirm)="saveNewProject()">
      <div class="space-y-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nome do Projeto</label>
          <input [(ngModel)]="newProject.name" placeholder="Ex: Landing Page de Alta Conversão" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none">
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">URL do Sistema (Domínio)</label>
          <input [(ngModel)]="newProject.url" placeholder="https://projeto.com" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none">
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Blueprint Neural</label>
          <textarea [(ngModel)]="newProject.blueprint" rows="5" placeholder="Descreva a arquitetura para as IAs..." class="w-full bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 text-xs text-indigo-200 focus:border-indigo-500 outline-none resize-none font-mono"></textarea>
        </div>
      </div>
    </app-nexus-modal>
  `
})
export class ClientsViewComponent {
  dataService = inject(DataService);
  
  isDrawerOpen = signal(false);
  isClientModalOpen = signal(false);
  isProjectModalOpen = signal(false);
  drawerType = signal<'client' | 'project'>('client');
  selectedData = signal<any>(null);
  
  searchTerm = '';

  newClient = { company: '', name: '', email: '' };
  newProject = { name: '', url: '', blueprint: '', clientId: '' };

  filteredClients = computed(() => {
    return this.dataService.clients().filter(c => 
      c.company.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  });

  getClientProjects(clientId: string) { return this.dataService.projects().filter(p => p.clientId === clientId); }

  openDetail(client: Client) { this.drawerType.set('client'); this.selectedData.set({ ...client }); this.isDrawerOpen.set(true); }
  openProject(project: any) { this.drawerType.set('project'); this.selectedData.set({ ...project }); this.isDrawerOpen.set(true); }

  openNewClientModal() { this.isClientModalOpen.set(true); }
  openNewProjectModal(clientId: string) { this.newProject.clientId = clientId; this.isProjectModalOpen.set(true); }

  async saveNewClient() {
    if (!this.newClient.company) return;
    await this.dataService.addClient({ ...this.newClient, status: 'Onboarding' });
    this.isClientModalOpen.set(false);
    this.newClient = { company: '', name: '', email: '' };
  }

  async saveNewProject() {
    if (!this.newProject.name) return;
    await this.dataService.addProject({ ...this.newProject, status: 'Planejamento' } as any);
    this.isProjectModalOpen.set(false);
    this.newProject = { name: '', url: '', blueprint: '', clientId: '' };
  }
}