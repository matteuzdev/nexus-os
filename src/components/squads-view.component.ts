import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Member, Squad, Message } from '../services/data.service';

@Component({
  selector: 'app-squads-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      
      <!-- Squads & Members Column -->
      <div class="lg:col-span-2 space-y-8 overflow-y-auto custom-scrollbar pr-2">
        <h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <svg class="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          Estrutura de Squads
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (squad of dataService.squads(); track squad.id) {
            <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-indigo-500/50 transition-all">
              <!-- Squad Header -->
              <div class="p-5 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-white">{{ squad.name }}</h4>
                  <p class="text-[10px] text-zinc-500 uppercase tracking-widest">{{ squad.kpi }}</p>
                </div>
                <div class="flex flex-col items-end">
                  <span class="text-xl font-bold text-emerald-400">{{ squad.healthScore }}%</span>
                  <span class="text-[8px] text-zinc-600 uppercase">Health Score</span>
                </div>
              </div>

              <!-- Members List -->
              <div class="p-5 space-y-4">
                @for (member of squad.members; track member.id) {
                  <div class="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800/50">
                    <div class="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-indigo-400 border border-zinc-700 relative">
                      {{ member.avatar }}
                      <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-950"
                        [class.bg-emerald-500]="member.status === 'Online'"
                        [class.bg-zinc-600]="member.status === 'Offline'"
                        [class.bg-amber-500]="member.status === 'Busy'"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-bold text-white truncate">{{ member.name }}</span>
                        <span class="text-[10px] text-zinc-500">{{ member.role }}</span>
                      </div>
                      <p class="text-[10px] text-indigo-500/80 truncate mt-0.5">
                        <span class="text-zinc-600">Atividade:</span> {{ member.lastActivity }}
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
      <div class="flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl h-[calc(100vh-12rem)]">
        <!-- Chat Header -->
        <div class="p-5 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <h4 class="font-bold text-white">Nexus Hub</h4>
          </div>
          <div class="flex gap-2">
            <button (click)="chatMode.set('all')" [class]="chatMode() === 'all' ? 'text-indigo-400' : 'text-zinc-600'" class="text-[10px] font-bold uppercase hover:text-white transition-colors">Log Geral</button>
            <span class="text-zinc-800">|</span>
            <button (click)="chatMode.set('private')" [class]="chatMode() === 'private' ? 'text-indigo-400' : 'text-zinc-600'" class="text-[10px] font-bold uppercase hover:text-white transition-colors">CEO & Orion</button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-zinc-950/30">
          @for (msg of filteredMessages(); track msg.id) {
            <div class="flex flex-col animate-in fade-in slide-in-from-bottom-1 duration-300">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] font-bold" [class]="msg.senderId === 'ceo' ? 'text-indigo-400' : 'text-emerald-400'">{{ msg.senderName }}</span>
                <span class="text-[8px] text-zinc-600 uppercase">{{ msg.timestamp | date:'HH:mm' }}</span>
              </div>
              <div class="p-3 rounded-2xl text-sm leading-relaxed max-w-[90%]"
                [class]="msg.senderId === 'ceo' ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-100 self-start' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 self-start'">
                {{ msg.content }}
              </div>
            </div>
          }
        </div>

        <!-- Input Area -->
        <div class="p-4 border-t border-zinc-800 bg-zinc-900/50">
          <form (submit)="send($event)" class="relative">
            <input name="chatInput" [(ngModel)]="newMessage" 
              class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 pr-12 text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-700"
              [placeholder]="chatMode() === 'private' ? 'Falar com Orion...' : 'Enviar para o time...'">
            <button type="submit" class="absolute right-2 top-1.5 p-1.5 text-indigo-500 hover:text-indigo-400 transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
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
  newMessage = '';
  chatMode = signal<'all' | 'private'>('private');

  filteredMessages = computed(() => {
    const isPrivate = this.chatMode() === 'private';
    return this.dataService.messages().filter(m => m.isPrivate === isPrivate);
  });

  send(e: Event) {
    e.preventDefault();
    if (!this.newMessage.trim()) return;
    
    const isPrivate = this.chatMode() === 'private';
    this.dataService.sendMessage(this.newMessage, isPrivate);
    
    // Orion Reply in Private
    if (isPrivate) {
      setTimeout(() => {
        this.dataService.sendMessage('👑 Entendido, Matteuz. Comando processado. O time está sendo notificado via Nexus OS.', true);
      }, 1000);
    }

    this.newMessage = '';
  }
}
