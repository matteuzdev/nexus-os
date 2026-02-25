import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- KPI Cards -->
      <div class="p-6 bg-zinc-900 border border-zinc-800 rounded-xl relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-all"></div>
        <h3 class="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">Pipeline de Vendas</h3>
        <p class="text-3xl font-bold text-white">R$ {{ dataService.pipelineValue() | number:'1.2-2' }}</p>
      </div>

      <div class="p-6 bg-zinc-900 border border-zinc-800 rounded-xl relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full group-hover:bg-indigo-500/20 transition-all"></div>
        <h3 class="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">Sprint Ativo</h3>
        <p class="text-3xl font-bold text-white">{{ dataService.activeTasks() }} <span class="text-base font-normal text-zinc-500">tarefas em andamento</span></p>
      </div>

      <div class="p-6 bg-zinc-900 border border-zinc-800 rounded-xl relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 rounded-full group-hover:bg-rose-500/20 transition-all"></div>
        <h3 class="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">Fila de Suporte</h3>
        <p class="text-3xl font-bold text-white">{{ dataService.openTickets() }} <span class="text-base font-normal text-zinc-500">tickets abertos</span></p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Activity / Focus -->
      <div class="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Foco da Semana (Anti-TDAH)
        </h3>
        <ul class="space-y-3">
          @for (task of dataService.tasks().slice(0, 3); track task.id) {
            <li class="flex items-center justify-between p-3 bg-zinc-950 rounded border border-zinc-800/50">
              <span class="text-zinc-300 text-sm">{{ task.title }}</span>
              <span class="text-xs px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{{ task.status }}</span>
            </li>
          }
        </ul>
      </div>

      <!-- Quick Actions -->
      <div class="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <h3 class="text-lg font-bold text-white mb-4">Ações Rápidas</h3>
        <div class="grid grid-cols-2 gap-4">
          <button (click)="createNewProject()" class="p-4 bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all rounded-lg text-left group">
            <span class="block text-emerald-500 mb-1 group-hover:scale-110 transition-transform origin-left">+</span>
            <span class="text-sm font-medium text-zinc-300">Novo Projeto</span>
          </button>
          <button (click)="createNewTask()" class="p-4 bg-zinc-950 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all rounded-lg text-left group">
            <span class="block text-indigo-500 mb-1 group-hover:scale-110 transition-transform origin-left">+</span>
            <span class="text-sm font-medium text-zinc-300">Criar Tarefa</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class DashboardViewComponent {
  dataService = inject(DataService);

  createNewProject() {
    const name = prompt('Nome do novo projeto:');
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

  createNewTask() {
    const title = prompt('Título da tarefa:');
    if (title) {
      this.dataService.addTask({
        title,
        type: 'Feature',
        points: 1,
        status: 'Backlog',
        tag: 'Inbox'
      });
    }
  }
}