import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, TaskStatus, Task } from '../services/data.service';
import { NexusDrawerComponent } from './nexus-drawer.component';

@Component({
  selector: 'app-kanban-view',
  standalone: true,
  imports: [CommonModule, NexusDrawerComponent],
  template: `
    <div class="flex flex-col h-full overflow-hidden">
      <!-- Kanban Header -->
      <div class="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h3 class="text-2xl font-bold text-white mb-1">Board de Engenharia</h3>
          <p class="text-sm text-zinc-500">Gestão técnica e execução de sprints da Konig Systems.</p>
        </div>
        <button (click)="createNewTask()" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 text-sm">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Nova Tarefa Técnica
        </button>
      </div>

      <!-- Kanban Board -->
      <div class="flex-1 overflow-x-auto pb-4 custom-scrollbar flex gap-4 items-start">
        @for (col of columns; track col) {
          <div 
            class="w-80 shrink-0 flex flex-col max-h-full bg-zinc-900/50 border rounded-2xl overflow-hidden transition-colors duration-200"
            [class.border-indigo-500]="dragOverColumn() === col"
            [class.bg-zinc-900]="dragOverColumn() === col"
            [class.border-zinc-800]="dragOverColumn() !== col"
            (dragover)="onDragOver($event, col)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event, col)"
          >
            <!-- Column Header -->
            <div class="p-4 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center sticky top-0 z-10 select-none">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" [ngClass]="getColumnColor(col)"></div>
                <span class="font-bold text-xs uppercase tracking-widest text-zinc-400">{{ col }}</span>
              </div>
              <span class="bg-zinc-800 text-zinc-500 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                {{ getTasksByStatus(col).length }}
              </span>
            </div>

            <!-- Tasks List -->
            <div class="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar min-h-[100px]">
              @for (task of getTasksByStatus(col); track task.id) {
                <div 
                  class="bg-zinc-950 border border-zinc-800 rounded-xl p-4 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer transition-all group relative select-none"
                  draggable="true"
                  (dragstart)="onDragStart($event, task)"
                  (click)="openDetail(task)"
                >
                  
                  <!-- Tags & ID -->
                  <div class="flex justify-between items-start mb-3">
                    <span class="text-[9px] font-mono text-zinc-600 uppercase tracking-wider font-bold">#{{ task.id.substring(1, 5) }}</span>
                    <span class="px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-tighter" [ngClass]="getTypeClass(task.type)">
                      {{ task.type }}
                    </span>
                  </div>

                  <!-- Title -->
                  <h5 class="text-sm text-zinc-200 font-bold mb-3 leading-snug group-hover:text-indigo-400 transition-colors">
                    {{ task.title }}
                  </h5>

                  <!-- Footer (Points & Activity) -->
                  <div class="flex justify-between items-center pt-3 border-t border-zinc-900/50 mt-2">
                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-1 text-[10px] text-zinc-600">
                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                        {{ task.comments.length }}
                      </div>
                      <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">{{ task.points }} pts</span>
                    </div>

                    @if (task.originTicketId) {
                      <div class="flex items-center gap-1 text-[9px] font-bold text-amber-500 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10">
                         TICKET
                      </div>
                    }
                  </div>
                </div>
              }
              
              @if (getTasksByStatus(col).length === 0) {
                <div class="h-20 border-2 border-dashed border-zinc-900 rounded-xl flex items-center justify-center text-zinc-700 text-[10px] uppercase font-bold">
                  Vazio
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
  selectedTask = signal<Task | null>(null);
  dragOverColumn = signal<string | null>(null);

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.dataService.tasks().filter(t => t.status === status);
  }

  openDetail(task: Task) {
    this.selectedTask.set({ ...task });
    this.isDrawerOpen.set(true);
  }

  createNewTask() {
    const title = prompt('Nome da tarefa técnica:');
    if (title) {
      this.dataService.addTask({
        title,
        description: '',
        type: 'Feature',
        points: 1,
        status: 'Backlog',
        tag: 'Dev',
        linkedProjectId: ''
      });
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'Feature': return 'bg-indigo-950 text-indigo-400 border-indigo-500/20';
      case 'Bug': return 'bg-rose-950 text-rose-400 border-rose-500/20';
      case 'Automação': return 'bg-purple-950 text-purple-400 border-purple-500/20';
      default: return 'bg-zinc-900 text-zinc-500 border-zinc-800';
    }
  }

  getColumnColor(col: string): string {
    switch(col) {
      case 'Backlog': return 'bg-zinc-600';
      case 'A Fazer': return 'bg-blue-500';
      case 'Em Progresso': return 'bg-indigo-500';
      case 'Revisão': return 'bg-purple-500';
      case 'Concluído': return 'bg-emerald-500';
      default: return 'bg-zinc-500';
    }
  }

  // --- Drag and Drop Logic ---
  onDragStart(event: DragEvent, task: Task) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', task.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent, col: TaskStatus) {
    event.preventDefault();
    this.dragOverColumn.set(col);
  }

  onDragLeave(event: DragEvent) {
    this.dragOverColumn.set(null);
  }

  onDrop(event: DragEvent, col: TaskStatus) {
    event.preventDefault();
    this.dragOverColumn.set(null);
    if (event.dataTransfer) {
      const taskId = event.dataTransfer.getData('text/plain');
      if (taskId) {
        this.dataService.moveTask(taskId, col);
      }
    }
  }
}
