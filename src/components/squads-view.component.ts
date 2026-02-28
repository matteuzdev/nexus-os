import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Member, Squad, Message } from '../services/data.service';
import { AiService } from '../services/ai.service';

@Component({
  selector: 'app-squads-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full overflow-hidden pb-4">
      
      <!-- Squads Sidebar -->
      <div class="xl:col-span-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
        <h3 class="text-xl font-black text-white uppercase tracking-tighter">Squads Ativos</h3>
        
        @for (squad of dataService.squads(); track squad.id) {
          <div class="p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] hover:border-indigo-500/50 transition-all group">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h4 class="font-bold text-white group-hover:text-indigo-400 transition-colors">{{ squad.name }}</h4>
                <p class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{{ squad.type }}</p>
              </div>
              <div class="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-lg border border-emerald-500/20">
                {{ squad.healthScore }}% Health
              </div>
            </div>

            <div class="space-y-4">
              @for (member of squad.members; track member.id) {
                <div class="flex items-center justify-between group/member">
                  <div class="flex items-center gap-3">
                    <div class="relative">
                      <div class="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-400 group-hover/member:border-indigo-500 transition-all">
                        {{ member.avatar }}
                      </div>
                      <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-900"
                        [class.bg-emerald-500]="member.status === 'Online'"
                        [class.bg-zinc-600]="member.status === 'Offline'"
                        [class.bg-amber-500]="member.status === 'Busy'">
                      </div>
                    </div>
                    <div>
                      <p class="text-[11px] font-bold text-zinc-300">{{ member.name }}</p>
                      <p class="text-[9px] text-zinc-600 leading-none">{{ member.role }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-[9px] font-black text-indigo-400">LVL {{ member.level }}</p>
                    <div class="w-12 h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                      <div class="h-full bg-indigo-500" [style.width.%]="(member.xp % 1000) / 10"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Telegram Bridge -->
        <div class="mt-auto p-6 bg-gradient-to-br from-indigo-600/20 to-zinc-900 border border-indigo-500/20 rounded-3xl">
           <h4 class="text-xs font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
             <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.68-.88-.47-1.38-.76-2.23-1.33-.98-.66-.35-1.02.22-1.6.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.18-.08-.04-.19-.01-.27.01-.11.02-1.83 1.16-5.16 3.5-.49.34-.93.5-1.33.49-.44-.01-1.28-.25-1.9-.46-.77-.25-1.38-.39-1.33-.82.03-.22.41-.45 1.14-.69 4.46-1.94 7.44-3.22 8.93-3.84 4.25-1.77 5.13-2.08 5.71-2.09.13 0 .42.03.61.18.16.12.2.28.22.4.02.08.03.22.01.36z"/></svg>
             Telegram Bridge
           </h4>
           <p class="text-[10px] text-zinc-400 mb-4">Sincronize a inteligência do Nexus com seu grupo de equipe.</p>
           <button class="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20">
             Abrir Grupo da Equipe
           </button>
        </div>
      </div>

      <!-- Live Neural Chat -->
      <div class="xl:col-span-3 flex flex-col bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <!-- Background decorative element -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
        
        <!-- Chat Header -->
        <div class="p-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md flex justify-between items-center shrink-0 z-10">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black">S</div>
            <div>
              <h3 class="font-bold text-white">Neural Squad Hub</h3>
              <p class="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Canal de Orquestração Ativo
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <button (click)="chatMode.set('squad')" [class.bg-indigo-600]="chatMode() === 'squad'" class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-800 transition-all">Equipe</button>
            <button (click)="chatMode.set('private')" [class.bg-indigo-600]="chatMode() === 'private'" class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-800 transition-all">Orion (Privado)</button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar z-10" #scrollContainer>
          @for (msg of filteredMessages(); track msg.id) {
            <div class="flex gap-4 group" [class.flex-row-reverse]="msg.senderId === 'ceo'">
              <!-- Avatar -->
              <div class="w-10 h-10 shrink-0 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-black text-indigo-400 group-hover:border-indigo-500 transition-all overflow-hidden shadow-lg">
                @if (msg.senderId === 'ceo' && dataService.currentUser()?.user_metadata?.['avatar_url']) {
                  <img [src]="dataService.currentUser()?.user_metadata?.['avatar_url']" class="w-full h-full object-cover">
                } @else {
                  {{ msg.senderName.substring(0,2).toUpperCase() }}
                }
              </div>
              
              <!-- Content -->
              <div class="flex flex-col gap-1.5 max-w-[70%]" [class.items-end]="msg.senderId === 'ceo'">
                <div class="flex items-center gap-2 px-1">
                  <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{{ msg.senderName }}</span>
                  <span class="text-[8px] text-zinc-700 font-mono">{{ msg.timestamp | date:'shortTime' }}</span>
                </div>
                <div class="p-4 rounded-3xl text-sm leading-relaxed shadow-xl border transition-all"
                  [class]="msg.senderId === 'ceo' ? 'bg-indigo-600 text-white rounded-tr-none border-indigo-500 shadow-indigo-500/10' : 'bg-zinc-950/80 border-zinc-800 text-zinc-300 rounded-tl-none hover:border-zinc-700'">
                  {{ msg.content }}
                </div>
              </div>
            </div>
          }
          
          @if (isThinking()) {
            <div class="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
              <div class="w-10 h-10 shrink-0 rounded-2xl bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-indigo-500/20">
                {{ thinkingAgent.substring(0,1) }}
              </div>
              <div class="bg-zinc-950 border border-zinc-800 p-4 rounded-3xl rounded-tl-none flex items-center gap-3">
                <div class="flex gap-1">
                  <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
                <span class="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{{ thinkingAgent }} está processando...</span>
              </div>
            </div>
          }
        </div>

        <!-- Input Area -->
        <div class="p-6 border-t border-zinc-800 bg-zinc-900/50 shrink-0 z-10">
          <form (submit)="send($event)" class="relative group">
            <div class="absolute inset-0 bg-indigo-500/5 blur-xl group-focus-within:bg-indigo-500/10 transition-all rounded-full"></div>
            <input name="chatInput" [(ngModel)]="newMessage" [disabled]="isThinking()" (keydown.enter)="send($event)"
              class="relative w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 pr-14 text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-800 font-medium disabled:opacity-50 shadow-inner"
              [placeholder]="chatMode() === 'private' ? 'Comando privado para Orion...' : 'Falar com o squad... Mencione @Ana, @Carla ou @Lucas'">
            <button type="button" (click)="send($event)" [disabled]="isThinking() || !newMessage.trim()" class="absolute right-3 top-2.5 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all active:scale-90 shadow-lg shadow-indigo-500/20 disabled:opacity-50">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class SquadsViewComponent {
  dataService = inject(DataService);
  aiService = inject(AiService);

  newMessage = '';
  chatMode = signal<'squad' | 'private'>('squad');
  isThinking = signal(false);
  thinkingAgent = '';

  filteredMessages = computed(() => {
    const msgs = this.dataService.messages();
    if (this.chatMode() === 'private') {
      return msgs.filter(m => m.isPrivate && (m.senderId === 'ceo' || m.senderName === 'Orion'));
    }
    return msgs.filter(m => !m.isPrivate);
  });

  async send(e: Event) {
    e.preventDefault();
    if (!this.newMessage.trim() || this.isThinking()) return;

    const messageText = this.newMessage;
    this.newMessage = '';

    const senderName = this.dataService.currentUser()?.user_metadata?.['full_name'] || 'Matteuz (CEO)';
    
    // 1. Send human message to Supabase
    await this.dataService.sendMessage(messageText, senderName, this.chatMode() === 'private');

    // 2. Check for AI Mentions or Private Mode
    const lowerMsg = messageText.toLowerCase();
    let targetAgent: any = null;

    if (this.chatMode() === 'private') targetAgent = 'orion';
    else if (lowerMsg.includes('@ana')) targetAgent = 'ana';
    else if (lowerMsg.includes('@carla')) targetAgent = 'carla';
    else if (lowerMsg.includes('@lucas')) targetAgent = 'lucas';
    else if (lowerMsg.includes('@orion')) targetAgent = 'orion';

    if (targetAgent && this.aiService.hasKey()) {
      this.isThinking.set(true);
      this.thinkingAgent = targetAgent.charAt(0).toUpperCase() + targetAgent.slice(1);
      
      try {
        const context = `Estamos no Squad Hub. O time está discutindo projetos e metas.`;
        const response = await this.aiService.chatWithAgent(targetAgent, messageText, context);
        await this.dataService.sendMessage(response, this.thinkingAgent, this.chatMode() === 'private');
      } catch (err) {
        console.error('Erro na IA:', err);
      } finally {
        this.isThinking.set(false);
      }
    }
  }
}