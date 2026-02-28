import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import { NexusModalComponent } from './nexus-modal.component';

@Component({
  selector: 'app-automations-view',
  standalone: true,
  imports: [CommonModule, FormsModule, NexusModalComponent],
  template: `
    <div class="h-full flex flex-col overflow-hidden bg-zinc-950">
      <header class="flex items-center justify-between shrink-0 mb-6 px-2">
        <div>
          <h3 class="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <svg class="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Automation Flows
          </h3>
          <p class="text-xs font-mono text-zinc-500 mt-1">Orquestração visual de regras e Agentes (Nexus Builder).</p>
        </div>
        <div class="flex items-center gap-4">
          <button class="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl border border-zinc-800 transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Meus Fluxos
          </button>
          <button class="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2" (click)="isModalOpen.set(true)">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            Novo Fluxo
          </button>
        </div>
      </header>

      <!-- Builder Area -->
      <div class="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden flex relative shadow-2xl">
        <div class="w-64 border-r border-zinc-800 bg-zinc-950/80 backdrop-blur-md p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar z-10">
          <h4 class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Gatilhos</h4>
          <div class="space-y-3">
            <div class="p-3 bg-zinc-900 border border-zinc-800 rounded-xl cursor-grab hover:border-emerald-500/50 transition-colors flex items-center gap-3">
              <span class="text-xs font-bold text-white">Lead Criado</span>
            </div>
          </div>
          <h4 class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-4">Ações</h4>
          <div class="space-y-3">
            <div class="p-3 bg-zinc-900 border border-zinc-800 rounded-xl cursor-grab hover:border-indigo-500/50 transition-colors flex items-center gap-3">
              <span class="text-xs font-bold text-white">Enviar E-mail</span>
            </div>
          </div>
        </div>

        <div class="flex-1 bg-zinc-950 relative overflow-hidden" 
             style="background-image: radial-gradient(circle at 1px 1px, #27272a 1px, transparent 0); background-size: 20px 20px;">
          <div class="absolute inset-0 flex items-center justify-center">
             <p class="text-zinc-800 font-black uppercase tracking-[0.5em] text-4xl opacity-20 select-none">Nexus Engine</p>
          </div>
        </div>
      </div>
    </div>

    <!-- New Flow Modal -->
    <app-nexus-modal
      [isOpen]="isModalOpen()"
      title="Novo Fluxo de Automação"
      subtitle="Definição de workflow neural"
      confirmLabel="Iniciar Builder"
      (close)="isModalOpen.set(false)"
      (confirm)="startNewFlow()">
      <div class="space-y-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nome do Fluxo</label>
          <input [(ngModel)]="flowName" placeholder="Ex: Onboarding Automático" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none">
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Objetivo do Fluxo</label>
          <textarea [(ngModel)]="flowDesc" rows="3" placeholder="O que este fluxo deve resolver?" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none resize-none text-sm"></textarea>
        </div>
      </div>
    </app-nexus-modal>
  `
})
export class AutomationsViewComponent {
  dataService = inject(DataService);
  isModalOpen = signal(false);
  flowName = '';
  flowDesc = '';

  startNewFlow() {
    if (!this.flowName) return;
    alert(`Fluxo "${this.flowName}" orquestrado! Iniciando motor de regras...`);
    this.isModalOpen.set(false);
    this.flowName = '';
    this.flowDesc = '';
  }
}