import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-automations-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
          <button class="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            Novo Fluxo
          </button>
        </div>
      </header>

      <!-- Builder Area -->
      <div class="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden flex relative shadow-2xl">
        
        <!-- Sidebar (Nodes) -->
        <div class="w-64 border-r border-zinc-800 bg-zinc-950/80 backdrop-blur-md p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar z-10">
          <h4 class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Gatilhos</h4>
          <div class="space-y-3">
            <div class="p-3 bg-zinc-900 border border-zinc-800 rounded-xl cursor-grab hover:border-emerald-500/50 transition-colors flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              </div>
              <span class="text-xs font-bold text-white">Lead Criado</span>
            </div>
            <div class="p-3 bg-zinc-900 border border-zinc-800 rounded-xl cursor-grab hover:border-emerald-500/50 transition-colors flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
              </div>
              <span class="text-xs font-bold text-white">Novo Chamado</span>
            </div>
          </div>

          <h4 class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-4">Ações</h4>
          <div class="space-y-3">
            <div class="p-3 bg-zinc-900 border border-zinc-800 rounded-xl cursor-grab hover:border-indigo-500/50 transition-colors flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                 <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.13.57-.072 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.001c6.552 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <span class="text-xs font-bold text-white">WhatsApp</span>
            </div>
            <div class="p-3 bg-zinc-900 border border-zinc-800 rounded-xl cursor-grab hover:border-indigo-500/50 transition-colors flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <span class="text-xs font-bold text-white">Enviar E-mail</span>
            </div>
          </div>

          <h4 class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-4">Inteligência (Minds)</h4>
          <div class="space-y-3">
            <div class="p-3 bg-zinc-900 border border-zinc-800 rounded-xl cursor-grab hover:border-purple-500/50 transition-colors flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-black text-[10px]">AS</div>
              <span class="text-xs font-bold text-white">Ana SDR</span>
            </div>
            <div class="p-3 bg-zinc-900 border border-zinc-800 rounded-xl cursor-grab hover:border-purple-500/50 transition-colors flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-black text-[10px]">CQ</div>
              <span class="text-xs font-bold text-white">Carla QA</span>
            </div>
          </div>
        </div>

        <!-- Canvas Background -->
        <div class="flex-1 bg-zinc-950 relative overflow-hidden" 
             style="background-image: radial-gradient(circle at 1px 1px, #27272a 1px, transparent 0); background-size: 20px 20px;">
          
          <!-- Mock Nodes on Canvas -->
          <div class="absolute top-20 left-20 w-64 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl">
             <div class="p-3 border-b border-zinc-800 flex items-center justify-between bg-emerald-500/10 rounded-t-2xl">
               <div class="flex items-center gap-2">
                 <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <span class="text-[10px] font-black uppercase text-emerald-400">Gatilho Inicial</span>
               </div>
               <svg class="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
             </div>
             <div class="p-4">
               <p class="text-sm font-bold text-white mb-1">Lead Convertido (Fechado)</p>
               <p class="text-[10px] text-zinc-500 font-mono">Dispara quando um Lead muda para "Fechado"</p>
             </div>
             <!-- Connecting port -->
             <div class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-800 border-4 border-zinc-950 rounded-full flex items-center justify-center z-10 cursor-crosshair">
               <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
             </div>
          </div>

          <!-- SVG Edge (Mock) -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none">
            <path d="M 336 140 C 450 140, 450 240, 520 240" fill="none" stroke="#6366f1" stroke-width="3" stroke-dasharray="4 4" class="animate-[dash_1s_linear_infinite]" />
          </svg>

          <div class="absolute top-[180px] left-[520px] w-64 bg-zinc-900 border border-indigo-500/50 rounded-2xl shadow-xl shadow-indigo-500/10">
             <!-- Input port -->
             <div class="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-800 border-4 border-zinc-950 rounded-full flex items-center justify-center z-10">
               <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
             </div>
             <div class="p-3 border-b border-zinc-800 flex items-center justify-between bg-indigo-500/10 rounded-t-2xl">
               <div class="flex items-center gap-2">
                 <svg class="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                 <span class="text-[10px] font-black uppercase text-indigo-400">Ação</span>
               </div>
             </div>
             <div class="p-4 space-y-3">
               <p class="text-sm font-bold text-white">Boas-vindas ao Cliente</p>
               <div class="bg-zinc-950 rounded p-2 text-[10px] font-mono text-zinc-500">
                 Para: {{'{lead.email}'}}<br>
                 Template: onboard-v1
               </div>
             </div>
          </div>

          <!-- Bottom Floating Bar -->
          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl">
            <button class="text-zinc-400 hover:text-white transition-colors" title="Desfazer">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
            </button>
            <button class="text-zinc-400 hover:text-white transition-colors" title="Refazer">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>
            </button>
            <div class="w-px h-5 bg-zinc-700"></div>
            <button class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Testar Fluxo
            </button>
            <button class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all">
              Salvar
            </button>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes dash {
      to {
        stroke-dashoffset: -8;
      }
    }
  `]
})
export class AutomationsViewComponent {
  dataService = inject(DataService);
}