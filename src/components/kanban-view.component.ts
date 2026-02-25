import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, TaskStatus, Task } from '../services/data.service';

@Component({
  selector: 'app-kanban-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex h-full gap-4 overflow-x-auto pb-4 items-start">
      @for (col of columns; track col) {
        <div 
          class="w-80 shrink-0 flex flex-col max-h-full bg-zinc-900/50 border rounded-xl overflow-hidden transition-colors duration-200"
          [class.border-indigo-500]="dragOverColumn() === col"
          [class.bg-zinc-900]="dragOverColumn() === col"
          [class.border-zinc-800]="dragOverColumn() !== col"
          (dragover)="onDragOver($event, col)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event, col)"
        >
          <!-- Column Header -->
          <div class="p-3 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center sticky top-0 z-10 select-none">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full" [ngClass]="getColumnColor(col)"></div>
              <span class="font-bold text-sm text-zinc-300">{{ col }}</span>
            </div>
            <span class="bg-zinc-800 text-zinc-500 text-xs px-2 py-0.5 rounded-full font-mono">
              {{ getTasksByStatus(col).length }}
            </span>
          </div>

          <!-- Tasks List -->
          <div class="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar min-h-[100px]">
            @for (task of getTasksByStatus(col); track task.id) {
              <div 
                class="bg-zinc-950 border border-zinc-800 rounded p-4 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 cursor-grab active:cursor-grabbing transition-all group relative select-none"
                draggable="true"
                (dragstart)="onDragStart($event, task)"
              >
                
                <!-- Tags & ID -->
                <div class="flex justify-between items-start mb-2">
                  <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{{ task.id }}</span>
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-bold border" [ngClass]="getTypeClass(task.type)">
                    {{ task.type }}
                  </span>
                </div>

                <!-- Product Link Indicator -->
                @if(task.linkedProductId) {
                  <div class="flex items-center gap-1 mb-2">
                    <svg class="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    <span class="text-[10px] text-zinc-500 truncate max-w-[150px]">{{ dataService.getProductName(task.linkedProductId!) }}</span>
                  </div>
                }

                <!-- Title -->
                <p class="text-sm text-zinc-200 font-medium mb-3 leading-snug">
                  {{ task.title }}
                </p>

                <!-- Footer (Points & Ticket Link) -->
                <div class="flex justify-between items-center pt-2 border-t border-zinc-900">
                  <div class="flex items-center gap-2">
                    <div class="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400" title="Pontos de Complexidade">
                      {{ task.points }}
                    </div>
                    <span class="text-[10px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">{{ task.tag }}</span>
                  </div>

                  @if (task.originTicketId) {
                    <div class="flex items-center gap-1 text-[10px] text-orange-400 bg-orange-950/30 px-1.5 py-0.5 rounded border border-orange-900/30">
                       <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                       Ticket #{{task.originTicketId}}
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
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
  
  // Drag and Drop State
  dragOverColumn = signal<string | null>(null);

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.dataService.tasks().filter(t => t.status === status);
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'Feature': return 'bg-indigo-900/20 text-indigo-400 border-indigo-500/20';
      case 'Bug': return 'bg-red-900/20 text-red-400 border-red-500/20';
      case 'Automação': return 'bg-purple-900/20 text-purple-400 border-purple-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
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
    event.preventDefault(); // Necessary to allow dropping
    this.dragOverColumn.set(col);
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDragLeave(event: DragEvent) {
    // Basic check to see if we left the column. 
    // In complex UI, this can flicker, but sufficient for simple columns.
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