import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nexus-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[200] flex items-center justify-center p-4" [class.pointer-events-none]="!isOpen">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500"
        [class.opacity-0]="!isOpen" (click)="close.emit()"></div>
      
      <!-- Modal Panel -->
      <div class="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl transition-all duration-500 transform overflow-hidden"
        [class.scale-95]="!isOpen" [class.opacity-0]="!isOpen" [class.translate-y-8]="!isOpen">
        
        <header class="p-8 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/30">
          <div>
            <h3 class="text-2xl font-black text-white tracking-tighter uppercase">{{ title }}</h3>
            <p class="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-widest">{{ subtitle }}</p>
          </div>
          <button (click)="close.emit()" class="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div class="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <ng-content></ng-content>
        </div>

        <footer class="p-8 border-t border-zinc-900 flex justify-end gap-4 bg-zinc-900/10">
          <button (click)="close.emit()" class="px-6 py-3 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Cancelar</button>
          <button (click)="confirm.emit()" class="px-10 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
            {{ confirmLabel }}
          </button>
        </footer>
      </div>
    </div>
  `
})
export class NexusModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Nova Ação';
  @Input() subtitle = 'Orquestração de Dados';
  @Input() confirmLabel = 'Confirmar';
  
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}