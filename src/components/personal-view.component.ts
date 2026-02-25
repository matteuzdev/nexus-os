import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, PersonalTask } from '../services/data.service';

@Component({
  selector: 'app-personal-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full overflow-hidden">
      <!-- ADHD Board (Goals & Tasks) -->
      <div class="lg:col-span-2 flex flex-col space-y-6 overflow-y-auto custom-scrollbar pr-2 pb-8">
        <header class="flex items-center justify-between">
          <div>
            <h3 class="text-3xl font-black text-white uppercase tracking-tighter">My Focus Space</h3>
            <p class="text-xs font-mono text-zinc-500 mt-1">Organização anti-TDAH. Apenas o que importa hoje.</p>
          </div>
          <button (click)="createTask()" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            Nova Foco
          </button>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Pending Tasks -->
          <div class="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
            <h4 class="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">Em Andamento</h4>
            <div class="space-y-4">
              @for (task of pendingTasks(); track task.id) {
                <div class="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 group hover:border-emerald-500/50 transition-all">
                  <div class="flex gap-4 items-start">
                    <button (click)="toggle(task.id)" class="w-6 h-6 rounded-lg border-2 border-zinc-700 mt-0.5 group-hover:border-emerald-500 flex items-center justify-center transition-colors">
                      <svg class="w-4 h-4 text-emerald-500 opacity-0 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <div class="flex-1">
                      <span class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border mb-2 inline-block"
                        [class.bg-indigo-900.text-indigo-400.border-indigo-500]="task.type === 'Meta'"
                        [class.bg-emerald-900.text-emerald-400.border-emerald-500]="task.type === 'Micro-tarefa'"
                        [class.bg-rose-900.text-rose-400.border-rose-500]="task.type === 'Ideia Maluca'">
                        {{ task.type }}
                      </span>
                      <p class="text-sm font-bold text-white leading-snug">{{ task.title }}</p>
                    </div>
                    <button (click)="deleteTask(task.id)" class="text-zinc-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              }
              @if (pendingTasks().length === 0) {
                <p class="text-center text-xs text-zinc-600 italic py-8">Tudo limpo por aqui! Você está livre.</p>
              }
            </div>
          </div>

          <!-- Completed Tasks -->
          <div class="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-6 opacity-70 hover:opacity-100 transition-opacity">
            <h4 class="text-xs font-black text-zinc-500 uppercase tracking-widest mb-6">Concluídas</h4>
            <div class="space-y-4">
              @for (task of completedTasks(); track task.id) {
                <div class="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 group">
                  <div class="flex gap-4 items-start">
                    <button (click)="toggle(task.id)" class="w-6 h-6 rounded-lg bg-emerald-500/20 border-2 border-emerald-500 mt-0.5 flex items-center justify-center">
                      <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <div class="flex-1">
                      <p class="text-sm font-bold text-zinc-500 line-through leading-snug">{{ task.title }}</p>
                    </div>
                    <button (click)="deleteTask(task.id)" class="text-zinc-700 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Orion AI Mentorship -->
      <div class="flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl h-full border-t-4 border-t-indigo-500">
        <div class="p-6 border-b border-zinc-800 flex items-center gap-4 shrink-0">
          <div class="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">O</div>
          <div>
            <h4 class="font-black text-white uppercase tracking-widest text-sm">Mentor Orion</h4>
            <p class="text-[10px] font-mono text-indigo-400">Guardião do seu foco</p>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" #scrollContainer>
           <!-- Initial Greeting -->
           <div class="flex gap-4">
             <div class="flex-1 bg-zinc-900/80 p-4 rounded-2xl rounded-tl-none border border-zinc-800 text-sm text-zinc-300 leading-relaxed shadow-md">
               <p>Olá Matteuz. Vi que você adicionou "Aprender crochê avançado".</p>
               <br>
               <p>Lembre-se do nosso acordo: <strong class="text-indigo-400">Você não precisa abraçar o mundo.</strong> A Konig Systems precisa do seu lado estratégico hoje. Que tal transformar isso em "Delegar o design do site X"? Posso te ajudar a automatizar.</p>
             </div>
           </div>

           <!-- Custom Chat Msgs -->
           @for (msg of filteredMessages(); track msg.id) {
             <div class="flex gap-4" [class.flex-row-reverse]="msg.senderId === 'ceo'">
               @if (msg.senderId !== 'ceo') {
                 <div class="w-8 h-8 shrink-0 rounded-xl bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">O</div>
               }
               <div class="p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] shadow-md border"
                 [class]="msg.senderId === 'ceo' ? 'bg-indigo-600 text-white rounded-tr-none border-indigo-500' : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 rounded-tl-none'">
                 {{ msg.content }}
               </div>
             </div>
           }
        </div>

        <div class="p-4 bg-zinc-950/80 border-t border-zinc-800 shrink-0">
          <form (submit)="send($event)" class="relative">
            <input name="chatInput" [(ngModel)]="newMessage" 
              class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 pr-12 text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-700"
              placeholder="Desabafe ou peça conselhos ao Orion...">
            <button type="submit" class="absolute right-3 top-3 p-1.5 text-indigo-500 hover:text-indigo-400 transition-colors">
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
export class PersonalViewComponent {
  dataService = inject(DataService);
  newMessage = '';

  pendingTasks = computed(() => this.dataService.personalTasks().filter(t => !t.isCompleted));
  completedTasks = computed(() => this.dataService.personalTasks().filter(t => t.isCompleted));

  filteredMessages = computed(() => this.dataService.messages().filter(m => m.isPrivate && m.senderName.includes('Mentoria')));

  createTask() {
    const title = prompt('O que você quer focar agora?');
    if (!title) return;
    
    let type: any = 'Micro-tarefa';
    if (title.toLowerCase().includes('crochê') || title.toLowerCase().includes('curso')) type = 'Ideia Maluca';
    if (title.toLowerCase().includes('meta') || title.toLowerCase().includes('objetivo')) type = 'Meta';

    this.dataService.addPersonalTask({ title, type, isCompleted: false });

    if (type === 'Ideia Maluca') {
      this.dataService.sendMessage(`Matteuz, vi que você adicionou "${title}". Respire fundo. Vamos focar no CRM da Konig primeiro? Deixa isso para o final de semana!`, 'Mentoria Orion', true);
    }
  }

  toggle(id: string) {
    this.dataService.togglePersonalTask(id);
  }

  deleteTask(id: string) {
    this.dataService.deletePersonalTask(id);
  }

  send(e: Event) {
    e.preventDefault();
    if (!this.newMessage.trim()) return;
    
    this.dataService.sendMessage(this.newMessage, 'Mentoria CEO', true);
    
    setTimeout(() => {
      this.dataService.sendMessage('Estou analisando seu padrão de foco. Sugiro que você automatize essa parte. Fica tranquilo que eu assumo o lado pesado da Engenharia. Mantenha-se na Estratégia.', 'Mentoria Orion', true);
    }, 1500);

    this.newMessage = '';
  }
}
