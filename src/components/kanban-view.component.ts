import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, TaskStatus, Task } from '../services/data.service';
import { NexusDrawerComponent } from './nexus-drawer.component';
import { NexusModalComponent } from './nexus-modal.component';

@Component({
  selector: 'app-kanban-view',
  standalone: true,
  imports: [CommonModule, FormsModule, NexusDrawerComponent, NexusModalComponent],
  template: `
    <div class="flex flex-col h-full overflow-hidden">
      <!-- Kanban Header -->
      <div class="flex items-center justify-between mb-8 shrink-0 px-2 flex-wrap gap-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:gap-8 flex-1">
          <div>
            <h3 class="text-3xl font-black text-white uppercase tracking-tighter">Engenharia Master</h3>
            <p class="text-xs font-mono text-zinc-500 mt-1">Status: <span class="text-indigo-400 font-bold">{{ dataService.activeTasks() }} tarefas em sprint</span></p>
          </div>

          <!-- Jira-style Filters -->
          <div class="flex items-center gap-3 flex-wrap">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input [(ngModel)]="searchTerm" placeholder="Buscar tarefa..." class="bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:border-indigo-500 outline-none w-48 transition-all">
            </div>
            
            <select [(ngModel)]="priorityFilter" class="bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-[10px] font-black uppercase text-zinc-400 outline-none focus:border-indigo-500 appearance-none cursor-pointer">
              <option value="ALL">Todas Prioridades</option>
              <option value="Urgente">Urgente</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>

            <select [(ngModel)]="projectFilter" class="bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-[10px] font-black uppercase text-zinc-400 outline-none focus:border-indigo-500 appearance-none cursor-pointer max-w-[150px]">
              <option value="ALL">Todos Projetos</option>
              @for (proj of dataService.projects(); track proj.id) {
                <option [value]="proj.id">{{ proj.name }}</option>
              }
            </select>
          </div>
        </div>

        <button (click)="isModalOpen.set(true)" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 text-sm uppercase tracking-widest font-black">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Novo Ticket
        </button>
      </div>

      <!-- Kanban Board -->
      <div class="flex-1 overflow-x-auto pb-6 custom-scrollbar flex gap-6 items-start">
        @for (col of columns; track col) {
          <div 
            class="w-80 shrink-0 flex flex-col max-h-full bg-zinc-900/30 border border-zinc-800 rounded-[2rem] overflow-hidden transition-all duration-300 group/column"
            [class.border-indigo-500]="dragOverColumn() === col"
            (dragover)="onDragOver($event, col)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event, col)"
          >
            <!-- Column Header -->
            <div class="p-5 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center sticky top-0 z-10 select-none">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" [ngClass]="getColumnColor(col)"></div>
                <span class="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400">{{ col }}</span>
              </div>
              <span class="bg-zinc-800 text-zinc-500 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                {{ getFilteredTasks(col).length }}
              </span>
            </div>

            <!-- Tasks List -->
            <div class="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar min-h-[150px]">
              @for (task of getFilteredTasks(col); track task.id) {
                <div 
                  class="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 hover:border-indigo-500/50 hover:shadow-2xl cursor-pointer transition-all group relative overflow-hidden animate-in fade-in"
                  draggable="true"
                  (dragstart)="onDragStart($event, task)"
                  (click)="openDetail(task)"
                >
                  
                  <div class="flex justify-between items-start mb-4">
                    <div class="flex flex-col gap-1">
                       <span class="text-[8px] font-black text-zinc-600 uppercase tracking-widest">#{{ task.id.substring(1, 6) }}</span>
                       <span class="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter">{{ task.category }}</span>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-tighter shadow-sm"
                      [class.bg-rose-500.text-white.border-rose-400]="task.priority === 'Urgente'"
                      [class.bg-orange-500/10.text-orange-400.border-orange-500/20]="task.priority === 'Alta'"
                      [class.bg-zinc-800.text-zinc-400.border-zinc-700]="task.priority === 'Média'">
                      {{ task.priority }}
                    </span>
                  </div>

                  <h5 class="text-sm text-zinc-200 font-bold mb-4 leading-snug group-hover:text-indigo-400 transition-colors">
                    {{ task.title }}
                  </h5>

                  <div class="flex justify-between items-center pt-4 border-t border-zinc-900">
                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-1.5 text-[10px] text-zinc-600">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                        {{ task.comments.length }}
                      </div>
                      <span class="bg-indigo-500/10 text-indigo-400 text-[8px] font-black px-1.5 py-0.5 rounded border border-indigo-500/20 uppercase">{{ task.stack }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                       <span class="text-[10px] font-black text-zinc-500">{{ task.points }} SP</span>
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
      [type]="'task'" 
      [data]="selectedTask()" 
      (close)="isDrawerOpen.set(false)">
    </app-nexus-drawer>

    <!-- New Task Modal -->
    <app-nexus-modal
      [isOpen]="isModalOpen()"
      title="Novo Ticket de Engenharia"
      subtitle="Planejamento técnico profissional"
      confirmLabel="Criar Ticket"
      (close)="isModalOpen.set(false)"
      (confirm)="saveNewTask()">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Resumo da Tarefa</label>
            <input [(ngModel)]="newTask.title" placeholder="Ex: Refatorar API de Clientes" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none">
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Descrição Detalhada</label>
            <textarea [(ngModel)]="newTask.description" rows="5" placeholder="Critérios de aceite..." class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none resize-none text-sm"></textarea>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Projeto Vinculado</label>
            <select [(ngModel)]="newTask.linkedProjectId" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none appearance-none">
              <option value="" disabled selected>Selecione o projeto...</option>
              @for (proj of dataService.projects(); track proj.id) {
                <option [value]="proj.id">{{ proj.name }}</option>
              }
            </select>
          </div>
        </div>
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Prioridade</label>
              <select [(ngModel)]="newTask.priority" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none">
                <option value="Baixa">Baixa</option>
                <option value="Média" selected>Média</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Story Points</label>
              <input type="number" [(ngModel)]="newTask.points" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none">
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Categoria Técnica</label>
            <input [(ngModel)]="newTask.category" placeholder="Backend, UI, DevOps..." class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none">
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Stack</label>
            <input [(ngModel)]="newTask.stack" placeholder="Angular, Supabase..." class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none">
          </div>
        </div>
      </div>
    </app-nexus-modal>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
  `]
})
export class KanbanViewComponent {
  dataService = inject(DataService);
  columns: TaskStatus[] = ['Backlog', 'A Fazer', 'Em Progresso', 'Revisão', 'Concluído'];
  
  isDrawerOpen = signal(false);
  isModalOpen = signal(false);
  selectedTask = signal<Task | null>(null);
  dragOverColumn = signal<string | null>(null);

  searchTerm = '';
  priorityFilter = 'ALL';
  projectFilter = 'ALL';

  newTask = {
    title: '',
    description: '',
    type: 'Feature' as any,
    priority: 'Média' as any,
    category: 'Geral',
    stack: 'N/A',
    points: 1,
    linkedProjectId: ''
  };

  getFilteredTasks(status: TaskStatus): Task[] {
    return this.dataService.tasks().filter(t => {
      const matchStatus = t.status === status;
      const matchSearch = t.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchPriority = this.priorityFilter === 'ALL' || t.priority === this.priorityFilter;
      const matchProject = this.projectFilter === 'ALL' || t.linkedProjectId === this.projectFilter;
      return matchStatus && matchSearch && matchPriority && matchProject;
    });
  }

  openDetail(task: Task) {
    this.selectedTask.set({ ...task });
    this.isDrawerOpen.set(true);
  }

  async saveNewTask() {
    if (!this.newTask.title) return;
    await this.dataService.addTask({ ...this.newTask, status: 'Backlog', tag: 'Dev' });
    this.isModalOpen.set(false);
    this.newTask = { title: '', description: '', type: 'Feature', priority: 'Média', category: 'Geral', stack: 'N/A', points: 1, linkedProjectId: '' };
  }

  getColumnColor(col: string): string {
    switch(col) {
      case 'Backlog': return 'bg-zinc-600';
      case 'A Fazer': return 'bg-blue-500';
      case 'Em Progresso': return 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]';
      case 'Revisão': return 'bg-purple-500';
      case 'Concluído': return 'bg-emerald-500';
      default: return 'bg-zinc-500';
    }
  }

  onDragStart(event: DragEvent, task: Task) { if (event.dataTransfer) { event.dataTransfer.setData('text/plain', task.id); event.dataTransfer.effectAllowed = 'move'; } }
  onDragOver(event: DragEvent, col: TaskStatus) { event.preventDefault(); this.dragOverColumn.set(col); }
  onDragLeave(event: DragEvent) { this.dragOverColumn.set(null); }
  onDrop(event: DragEvent, col: TaskStatus) {
    event.preventDefault(); this.dragOverColumn.set(null);
    if (event.dataTransfer) { const taskId = event.dataTransfer.getData('text/plain'); if (taskId) this.dataService.moveTask(taskId, col); }
  }
}