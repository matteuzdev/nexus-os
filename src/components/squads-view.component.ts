import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Member, Squad, Message } from '../services/data.service';
import { AiService, AgentName } from '../services/ai.service';

@Component({
  selector: 'app-squads-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full overflow-hidden">
      
      <!-- Squads & Members Column -->
      <div class="lg:col-span-2 space-y-8 overflow-y-auto custom-scrollbar pr-2">
        <h3 class="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
          <svg class="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          Estrutura de Squads
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (squad of dataService.squads(); track squad.id) {
            <div class="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden group hover:border-indigo-500/50 transition-all shadow-xl">
              <!-- Squad Header -->
              <div class="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                <div>
                  <h4 class="font-black text-white uppercase tracking-widest text-xs">{{ squad.name }}</h4>
                  <p class="text-[10px] text-zinc-500 font-mono mt-1">{{ squad.kpi }}</p>
                </div>
                <div class="flex flex-col items-end">
                  <span class="text-2xl font-black text-emerald-400">{{ squad.healthScore }}%</span>
                  <span class="text-[8px] text-zinc-600 uppercase font-bold">Health</span>
                </div>
              </div>

              <!-- Members List -->
              <div class="p-6 space-y-4">
                @for (member of squad.members; track member.id) {
                  <div class="flex items-center gap-4 p-4 bg-zinc-950 rounded-2xl border border-zinc-800/50 group/item hover:bg-zinc-900 transition-colors">
                    <div class="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center font-black text-sm text-indigo-400 border border-zinc-800 relative group-hover/item:border-indigo-500/50 transition-all">
                      {{ member.avatar }}
                      <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-zinc-950"
                        [class.bg-emerald-500]="member.status === 'Online'"
                        [class.bg-zinc-600]="member.status === 'Offline'"
                        [class.bg-amber-500]="member.status === 'Busy'"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-sm font-bold text-white truncate">{{ member.name }}</span>
                        <span class="text-[9px] font-black text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">Lvl {{ member.level || 1 }}</span>
                      </div>
                      
                      <!-- XP Bar -->
                      <div class="w-full bg-zinc-800 rounded-full h-1.5 mb-2 overflow-hidden">
                        <div class="bg-indigo-500 h-1.5 rounded-full transition-all duration-1000" [style.width]="((member.xp || 0) / ((member.level || 1) * 1000) * 100) + '%'"></div>
                      </div>

                      <p class="text-[10px] text-zinc-500 truncate">
                        <span class="text-emerald-500/70 font-bold uppercase text-[8px]">Última Atividade:</span> {{ member.lastActivity }}
                      </p>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Nexus Communication Hub (Chat) -->
      <div class="flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl h-full border-l-4 border-l-indigo-600/20">
        <!-- Chat Header -->
        <div class="p-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <h4 class="font-black text-white uppercase tracking-widest text-xs">Nexus Hub</h4>
          </div>
          <div class="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button (click)="chatMode.set('all')" [class]="chatMode() === 'all' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-600'" class="text-[9px] font-black px-3 py-1 rounded uppercase transition-all">Geral</button>
            <button (click)="chatMode.set('private')" [class]="chatMode() === 'private' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-600'" class="text-[9px] font-black px-3 py-1 rounded uppercase transition-all">Privado</button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-zinc-950/20" #scrollContainer>
          @for (msg of filteredMessages(); track msg.id) {
            <div class="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[8px] font-black"
                  [class.text-indigo-400]="msg.senderId === 'ceo'"
                  [class.text-emerald-400]="msg.senderId !== 'ceo'">
                  {{ msg.senderName.substring(0,1) }}
                </div>
                <span class="text-[10px] font-black uppercase tracking-tighter" [class]="msg.senderId === 'ceo' ? 'text-indigo-400' : 'text-emerald-400'">{{ msg.senderName }}</span>
                <span class="text-[8px] text-zinc-700 font-mono">{{ msg.timestamp | date:'HH:mm' }}</span>
              </div>
              <div class="p-4 rounded-2xl text-sm leading-relaxed max-w-[95%] shadow-sm border whitespace-pre-wrap"
                [class]="msg.senderId === 'ceo' ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-100 rounded-tl-none ml-2' : 'bg-zinc-900 border-zinc-800 text-zinc-300 rounded-tl-none ml-2'">
                {{ msg.content }}
              </div>
            </div>
          }
          
          @if (isThinking()) {
            <div class="flex items-center gap-3 text-zinc-500 p-4">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
              <span class="text-[10px] font-bold uppercase tracking-widest">{{ thinkingAgent }} está processando...</span>
            </div>
          }
        </div>

        <!-- Input Area -->
        <div class="p-6 border-t border-zinc-800 bg-zinc-900/50 shrink-0">
          <form (submit)="send($event)" class="relative group">
            <div class="absolute inset-0 bg-indigo-500/5 blur-xl group-focus-within:bg-indigo-500/10 transition-all rounded-full"></div>
            <input name="chatInput" [(ngModel)]="newMessage" [disabled]="isThinking() || !aiService.hasKey()"
              class="relative w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 pr-14 text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-800 font-medium disabled:opacity-50"
              [placeholder]="aiService.hasKey() ? (chatMode() === 'private' ? 'Comando privado para Orion...' : 'Falar com o squad... Mencione @Ana, @Carla ou @Lucas') : 'Insira a GEMINI_KEY no LocalStorage para conversar.'">
            <button type="submit" [disabled]="isThinking() || !aiService.hasKey()" class="absolute right-3 top-2.5 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all active:scale-90 shadow-lg shadow-indigo-500/20 disabled:opacity-50">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 2px; }
  `]
})
export class SquadsViewComponent {
  dataService = inject(DataService);
  aiService = inject(AiService);
  
  newMessage = '';
  chatMode = signal<'all' | 'private'>('private');
  isThinking = signal(false);
  thinkingAgent = '';

  filteredMessages = computed(() => {
    const isPrivate = this.chatMode() === 'private';
    return this.dataService.messages().filter(m => m.isPrivate === isPrivate);
  });

  async send(e: Event) {
    e.preventDefault();
    if (!this.newMessage.trim() || this.isThinking() || !this.aiService.hasKey()) return;
    
    const isPrivate = this.chatMode() === 'private';
    const sender = 'Matteuz (CEO)';
    const text = this.newMessage;
    
    await this.dataService.sendMessage(text, sender, isPrivate);
    this.newMessage = '';
    
    // Context to give AI awareness of the agency state
    const activeTasks = this.dataService.tasks().filter(t => t.status === 'Em Progresso').length;
    const leads = this.dataService.leads().length;
    const openTickets = this.dataService.tickets().filter(t => t.status !== 'Resolvido').length;
    const context = `Pipeline atual: ${leads} Leads. Tasks de Engenharia: ${activeTasks}. Chamados Abertos: ${openTickets}. CEO Matteuz está no comando.`;
    
    if (!isPrivate) {
      await this.triggerAgentMind(text, context);
    } else {
      await this.chatWithOrion(text, context);
    }
  }

  async triggerAgentMind(message: string, context: string) {
    const text = message.toLowerCase();
    
    // Detect Who to call
    let agentToCall: AgentName | null = null;
    let agentName = '';
    let xpTarget = '';
    
    if (text.includes('@ana') || text.includes('vendas') || text.includes('sdr') || text.includes('lead')) {
      agentToCall = 'ana'; agentName = 'Ana SDR'; xpTarget = 'm1';
    } else if (text.includes('@carla') || text.includes('qa') || text.includes('bug') || text.includes('suporte') || text.includes('erro')) {
      agentToCall = 'carla'; agentName = 'Carla QA'; xpTarget = 'm4';
    } else if (text.includes('@lucas') || text.includes('cs') || text.includes('cliente') || text.includes('onboarding')) {
      agentToCall = 'lucas'; agentName = 'Lucas CS'; xpTarget = 'm2';
    } else if (text.includes('@orion') || text.includes('dev') || text.includes('codigo') || text.includes('build')) {
      agentToCall = 'orion'; agentName = 'Orion (AI)'; xpTarget = 'm3';
    } else {
      // Default to Orion orchestrating if no specific mention
      agentToCall = 'orion'; agentName = 'Orion (AI)'; xpTarget = 'm3';
    }

    this.isThinking.set(true);
    this.thinkingAgent = agentName;
    
    const response = await this.aiService.chatWithAgent(agentToCall, message, context);
    await this.dataService.sendMessage(response, agentName, false);
    
    if (xpTarget) {
      await this.dataService.addXP(xpTarget, 10);
    }
    
    this.isThinking.set(false);
  }

  async chatWithOrion(message: string, context: string) {
    this.isThinking.set(true);
    this.thinkingAgent = 'Orion';
    const response = await this.aiService.chatWithAgent('orion', message, context);
    await this.dataService.sendMessage(response, 'Orion', true);
    this.isThinking.set(false);
  }
}
