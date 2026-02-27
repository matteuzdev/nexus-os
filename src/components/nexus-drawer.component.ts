import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Lead, Task, Ticket, Client } from '../services/data.service';

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
      <div class="absolute inset-y-0 right-0 max-w-2xl w-full bg-zinc-950 border-l border-zinc-800 shadow-2xl transition-transform duration-500 transform flex flex-col"
        [class.translate-x-full]="!isOpen">
        
        @if (data) {
          <div class="h-full flex flex-col overflow-hidden">
            <!-- Header -->
            <header class="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 shrink-0">
               <div>
                 <div class="flex items-center gap-2 mb-1">
                   <span class="text-[10px] text-indigo-500 uppercase tracking-widest font-black bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{{ type }}</span>
                   <span class="text-[10px] text-zinc-600 font-mono">#{{ data.id }}</span>
                 </div>
                 <h2 class="text-xl font-bold text-white">{{ getTitle() }}</h2>
               </div>
               <button (click)="close.emit()" class="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
                 <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </header>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
              
              <!-- Client Specific -->
              @if (type === 'client') {
                <div class="space-y-8">
                  <div class="grid grid-cols-1 gap-6 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                    <div>
                      <label class="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Nome da Empresa</label>
                      <input [(ngModel)]="asClient().company" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white outline-none focus:border-indigo-500">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Nome do Contato</label>
                        <input [(ngModel)]="asClient().name" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white outline-none focus:border-indigo-500">
                      </div>
                      <div>
                        <label class="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Status</label>
                        <select [(ngModel)]="asClient().status" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white outline-none focus:border-indigo-500 appearance-none">
                          <option value="Ativo">Ativo</option>
                          <option value="Inativo">Inativo</option>
                          <option value="Onboarding">Onboarding</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label class="text-[10px] text-zinc-500 uppercase font-bold block mb-1">E-mail</label>
                      <input [(ngModel)]="asClient().email" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white outline-none focus:border-indigo-500">
                    </div>
                  </div>
                </div>
              }

              <!-- Lead Specific -->
              @if (type === 'lead') {
                <div class="space-y-8">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                    <div class="space-y-4">
                      <div>
                        <label class="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Nome do Contato</label>
                        <input [(ngModel)]="asLead().contact" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white outline-none focus:border-indigo-500">
                      </div>
                      <div>
                        <label class="text-[10px] text-zinc-500 uppercase font-bold block mb-1">E-mail</label>
                        <input [(ngModel)]="asLead().email" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white outline-none focus:border-indigo-500">
                      </div>
                      <div>
                        <label class="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Telefone / WhatsApp</label>
                        <input [(ngModel)]="asLead().phone" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white outline-none focus:border-indigo-500">
                      </div>
                      <div>
                        <label class="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Valor Estimado (R$)</label>
                        <input type="number" [(ngModel)]="asLead().value" class="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-emerald-400 font-bold outline-none focus:border-indigo-500">
                      </div>
                    </div>

                    <div class="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 space-y-3">
                      <h4 class="text-[10px] text-zinc-500 font-bold uppercase mb-2">Ações de Growth</h4>
                      <button (click)="triggerAction('whatsapp')" class="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-all">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.13.57-.072 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.001c6.552 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp Direto
                      </button>
                      <button (click)="triggerAction('email')" class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-all">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Enviar E-mail
                      </button>
                      <button (click)="triggerAction('automation')" class="w-full py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded flex items-center justify-center gap-2 transition-all">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Disparar Fluxo IA
                      </button>
                    </div>
                  </div>

                  <!-- SDR Dossier -->
                  <div class="p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl space-y-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    
                    <h3 class="text-sm font-black text-indigo-400 flex items-center gap-2 uppercase tracking-[0.2em]">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      Dossiê de Investigação SDR
                    </h3>
                    
                    <div class="grid grid-cols-2 gap-6">
                      <div>
                        <label class="text-[10px] text-zinc-500 uppercase font-black block mb-1">Setor / Indústria</label>
                        <input [(ngModel)]="asLead().investigation.industry" placeholder="Ex: E-commerce, Fintech..." class="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 outline-none focus:border-indigo-500">
                      </div>
                      <div>
                        <label class="text-[10px] text-zinc-500 uppercase font-black block mb-1">Tamanho da Empresa</label>
                        <select [(ngModel)]="asLead().investigation.companySize" class="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 outline-none focus:border-indigo-500 appearance-none">
                          <option value="1-10">1-10 funcionários</option>
                          <option value="11-50">11-50 funcionários</option>
                          <option value="51-200">51-200 funcionários</option>
                          <option value="201+">201+ funcionários</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label class="text-[10px] text-zinc-500 uppercase font-black block mb-1">Pain Points (Dores Principais)</label>
                      <textarea [(ngModel)]="asLead().investigation.painPoints" rows="3" placeholder="O que tira o sono desse cliente?" class="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 outline-none focus:border-indigo-500 resize-none"></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-6">
                      <div>
                        <label class="text-[10px] text-zinc-500 uppercase font-black block mb-1">Stack Atual</label>
                        <input [(ngModel)]="asLead().investigation.techStack" placeholder="O que eles usam hoje?" class="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 outline-none focus:border-indigo-500">
                      </div>
                      <div>
                        <label class="text-[10px] text-zinc-500 uppercase font-black block mb-1">Tomador de Decisão</label>
                        <input [(ngModel)]="asLead().investigation.decisionMaker" placeholder="Quem assina o cheque?" class="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 outline-none focus:border-indigo-500">
                      </div>
                    </div>

                    <div>
                      <label class="text-[10px] text-zinc-500 uppercase font-black block mb-1">Notas da SDR</label>
                      <textarea [(ngModel)]="asLead().investigation.notes" rows="4" placeholder="Observações livres da investigação..." class="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 outline-none focus:border-indigo-500 resize-none"></textarea>
                    </div>
                  </div>
                </div>
              }

              <!-- Task Specific: Jira-style Execution -->
              @if (type === 'task') {
                <div class="space-y-8">
                  <div class="flex items-center gap-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <div class="flex-1">
                      <label class="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Responsável</label>
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[8px] font-bold">OX</div>
                        <span class="text-sm text-zinc-300">Orion (AI Agent)</span>
                      </div>
                    </div>
                    <div class="w-px h-10 bg-zinc-800"></div>
                    <div>
                      <label class="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Complexidade</label>
                      <span class="text-sm font-bold text-white">{{ asTask().points }} Story Points</span>
                    </div>
                  </div>

                  <div>
                    <label class="text-[10px] text-zinc-500 uppercase font-bold block mb-2">Descrição Técnica</label>
                    <textarea [(ngModel)]="asTask().description" rows="6" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 outline-none focus:border-indigo-500 resize-none font-mono"></textarea>
                  </div>

                  <!-- Comments / Timeline -->
                  <div class="space-y-6">
                    <h3 class="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                      <div class="w-1 h-4 bg-indigo-500"></div>
                      Timeline de Colaboração
                    </h3>
                    
                    <div class="space-y-6">
                      @for (comment of asTask().comments; track comment.id) {
                        <div class="flex gap-4">
                          <div class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0 border border-zinc-700">
                            {{ comment.author.substring(0,2).toUpperCase() }}
                          </div>
                          <div class="flex-1 bg-zinc-900/50 p-4 rounded-2xl rounded-tl-none border border-zinc-800 group relative">
                            <div class="flex justify-between mb-2">
                              <span class="text-xs font-bold text-indigo-400">{{ comment.author }}</span>
                              <span class="text-[9px] text-zinc-600 font-mono">{{ comment.timestamp | date:'shortTime' }}</span>
                            </div>
                            <p class="text-sm text-zinc-400 leading-relaxed">{{ comment.text }}</p>
                          </div>
                        </div>
                      }
                    </div>
                    
                    <!-- New Comment -->
                    <div class="flex gap-4 mt-8 pt-6 border-t border-zinc-900">
                       <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-lg shadow-indigo-500/20">CEO</div>
                       <div class="flex-1 relative">
                         <input #commentInput (keyup.enter)="addComment(commentInput)" placeholder="Adicionar nota técnica ou feedback..." class="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 pr-12 text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-700 shadow-inner">
                         <button (click)="addComment(commentInput)" class="absolute right-2 top-1.5 p-1.5 text-indigo-500 hover:text-indigo-400">
                           <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                         </button>
                       </div>
                    </div>
                  </div>
                </div>
              }

            </div>

            <!-- Footer -->
            <footer class="p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md shrink-0 flex justify-between items-center">
              <button (click)="delete()" class="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                Excluir {{ type }}
              </button>
              <div class="flex gap-3">
                <button (click)="close.emit()" class="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Cancelar</button>
                <button (click)="save()" class="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
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
  @Input() type: 'lead' | 'task' | 'ticket' | 'client' = 'lead';
  @Input() data: any = null;

  @Output() close = new EventEmitter<void>();

  asLead() { return this.data as Lead; }
  asTask() { return this.data as Task; }
  asClient() { return this.data as Client; }

  getTitle() {
    if (this.type === 'lead') return this.asLead().company;
    if (this.type === 'task') return this.asTask().title;
    if (this.type === 'client') return this.asClient().company;
    return 'Detalhes';
  }

  save() {
    if (this.type === 'lead') this.dataService.updateLead(this.asLead());
    if (this.type === 'task') this.dataService.updateTask(this.asTask());
    if (this.type === 'client') this.dataService.updateClient(this.asClient());
    this.close.emit();
  }

  delete() {
    if (!confirm(`Deseja realmente eliminar este registro da Konig Systems?`)) return;
    if (this.type === 'lead') this.dataService.deleteLead(this.data.id);
    if (this.type === 'client') this.dataService.deleteClient(this.data.id);
    this.close.emit();
  }

  addComment(input: HTMLInputElement) {
    if (!input.value.trim()) return;
    this.dataService.addTaskComment(this.data.id, 'Matteuz (CEO)', input.value);
    input.value = '';
  }

  triggerAction(action: string) {
    alert(`Automação Nexus: Disparando ${action} para ${this.asLead().contact}...`);
    this.dataService.sendMessage(`Auto-Growth: ${action} disparado para o lead ${this.asLead().company}.`, 'Nexus AI');
  }
}