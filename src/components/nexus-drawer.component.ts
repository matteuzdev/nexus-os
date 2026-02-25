import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Lead, Task, Ticket } from '../services/data.service';

@Component({
  selector: 'app-nexus-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-[100] overflow-hidden" [class.pointer-events-none]="!isOpen">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
        [class.opacity-0]="!isOpen" (click)="close.emit()"></div>
      
      <!-- Drawer Panel -->
      <div class="absolute inset-y-0 right-0 max-w-2xl w-full bg-zinc-950 border-l border-zinc-800 shadow-2xl transition-transform duration-500 transform"
        [class.translate-x-full]="!isOpen">
        
        @if (data) {
          <div class="h-full flex flex-col">
            <!-- Header -->
            <header class="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
               <div>
                 <span class="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{{ type }} #{{ data.id }}</span>
                 <h2 class="text-xl font-bold text-white">{{ getTitle() }}</h2>
               </div>
               <button (click)="close.emit()" class="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
                 <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </header>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
              
              <!-- Lead Specific: Investigation -->
              @if (type === 'lead') {
                <div class="space-y-6">
                  <div class="grid grid-cols-2 gap-6">
                    <div>
                      <label class="text-[10px] text-zinc-500 uppercase font-bold block mb-2">Contato</label>
                      <input [(ngModel)]="asLead().contact" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none">
                    </div>
                    <div>
                      <label class="text-[10px] text-zinc-500 uppercase font-bold block mb-2">Valor Estimado</label>
                      <input type="number" [(ngModel)]="asLead().value" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none">
                    </div>
                  </div>

                  <div class="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl space-y-4">
                    <h3 class="text-sm font-bold text-indigo-400 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      Dossiê de Investigação SDR
                    </h3>
                    
                    <div>
                      <label class="text-[10px] text-zinc-500 uppercase block mb-1">Pain Points (Dores)</label>
                      <textarea [(ngModel)]="asLead().investigation.painPoints" rows="3" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 outline-none focus:border-indigo-500"></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="text-[10px] text-zinc-500 uppercase block mb-1">Stack Tecnológica</label>
                        <input [(ngModel)]="asLead().investigation.techStack" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 outline-none focus:border-indigo-500">
                      </div>
                      <div>
                        <label class="text-[10px] text-zinc-500 uppercase block mb-1">Tomador de Decisão</label>
                        <input [(ngModel)]="asLead().investigation.decisionMaker" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 outline-none focus:border-indigo-500">
                      </div>
                    </div>
                  </div>
                </div>
              }

              <!-- Task Specific: Kanban Details -->
              @if (type === 'task') {
                <div class="space-y-6">
                  <div>
                    <label class="text-[10px] text-zinc-500 uppercase font-bold block mb-2">Descrição Técnica</label>
                    <textarea [(ngModel)]="asTask().description" rows="4" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 outline-none focus:border-indigo-500"></textarea>
                  </div>

                  <!-- Comments / Timeline -->
                  <div class="space-y-4">
                    <h3 class="text-sm font-bold text-white uppercase tracking-wider">Timeline de Colaboração</h3>
                    <div class="space-y-4">
                      @for (comment of asTask().comments; track comment.id) {
                        <div class="flex gap-4">
                          <div class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0">
                            {{ comment.author.substring(0,2).toUpperCase() }}
                          </div>
                          <div class="flex-1 bg-zinc-900 p-4 rounded-2xl rounded-tl-none border border-zinc-800">
                            <div class="flex justify-between mb-1">
                              <span class="text-xs font-bold text-zinc-300">{{ comment.author }}</span>
                              <span class="text-[10px] text-zinc-600">{{ comment.timestamp | date:'short' }}</span>
                            </div>
                            <p class="text-sm text-zinc-400">{{ comment.text }}</p>
                          </div>
                        </div>
                      }
                    </div>
                    
                    <!-- New Comment -->
                    <div class="flex gap-4 mt-6">
                       <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">ME</div>
                       <div class="flex-1 relative">
                         <input #commentInput (keyup.enter)="addComment(commentInput)" placeholder="Adicionar comentário..." class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pr-12 text-sm text-white focus:border-indigo-500 outline-none transition-all">
                         <button (click)="addComment(commentInput)" class="absolute right-2 top-1.5 p-1.5 text-indigo-500 hover:text-indigo-400">
                           <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                         </button>
                       </div>
                    </div>
                  </div>
                </div>
              }

            </div>

            <!-- Footer -->
            <footer class="p-6 border-t border-zinc-800 bg-zinc-900/50 flex justify-between">
              <button (click)="delete()" class="px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                Excluir {{ type }}
              </button>
              <div class="flex gap-3">
                <button (click)="close.emit()" class="px-6 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors">Cancelar</button>
                <button (click)="save()" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all">
                  Salvar Alterações
                </button>
              </div>
            </footer>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 2px; }
  `]
})
export class NexusDrawerComponent {
  dataService = inject(DataService);

  @Input() isOpen = false;
  @Input() type: 'lead' | 'task' | 'ticket' = 'lead';
  @Input() data: any = null;

  @Output() close = new EventEmitter<void>();

  asLead() { return this.data as Lead; }
  asTask() { return this.data as Task; }

  getTitle() {
    if (this.type === 'lead') return this.asLead().company;
    if (this.type === 'task') return this.asTask().title;
    return 'Detalhes';
  }

  save() {
    if (this.type === 'lead') this.dataService.updateLead(this.asLead());
    if (this.type === 'task') this.dataService.updateTask(this.asTask());
    this.close.emit();
  }

  delete() {
    if (!confirm(`Tem certeza que deseja excluir este ${this.type}?`)) return;
    if (this.type === 'lead') this.dataService.deleteLead(this.data.id);
    this.close.emit();
  }

  addComment(input: HTMLInputElement) {
    if (!input.value.trim()) return;
    this.dataService.addTaskComment(this.data.id, 'Matteuz (CEO)', input.value);
    input.value = '';
  }
}
