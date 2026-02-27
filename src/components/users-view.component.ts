import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-users-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col space-y-8 overflow-hidden">
      <header class="shrink-0">
        <h3 class="text-3xl font-black text-white uppercase tracking-tighter">Gestão de Acessos</h3>
        <p class="text-xs font-mono text-zinc-500 mt-1">Convide sua equipe ou libere acesso para clientes.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 overflow-hidden">
        <!-- Invite Form -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl flex flex-col h-fit">
          <h4 class="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4 flex items-center gap-2">
             <svg class="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
             Novo Acesso
          </h4>
          
          <form (submit)="inviteUser($event)" class="space-y-6 flex-1">
            @if (successMessage()) {
              <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold text-center animate-in fade-in">
                {{ successMessage() }}
              </div>
            }

            <div>
              <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">E-mail do Convidado</label>
              <input type="email" [(ngModel)]="inviteEmail" name="email" required
                class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors">
            </div>

            <div>
              <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Nível de Permissão</label>
              <select [(ngModel)]="inviteRole" name="role" required
                class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors appearance-none">
                <option value="admin">Administrador (Staff Konig)</option>
                <option value="client">Cliente (Apenas Suporte)</option>
              </select>
            </div>

            @if (inviteRole === 'client') {
              <div>
                <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Empresa (Opcional)</label>
                <input type="text" [(ngModel)]="inviteCompany" name="company" placeholder="Ex: Barbearia Silva"
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors">
              </div>
            }

            <button type="submit" [disabled]="loading()"
              class="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50">
              Enviar Convite
            </button>
          </form>
        </div>

        <!-- Users List placeholder -->
        <div class="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl flex flex-col h-full overflow-hidden">
          <h4 class="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">Acessos Concedidos</h4>
          
          <div class="flex-1 flex flex-col items-center justify-center text-zinc-600 space-y-4">
             <svg class="w-12 h-12 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
             <p class="text-xs uppercase font-bold tracking-widest text-center">Gestão de lista de usuários requer API Admin do Supabase.<br>Utilize o painel da Supabase para revogar acessos.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UsersViewComponent {
  dataService = inject(DataService);
  
  inviteEmail = '';
  inviteRole: 'admin' | 'client' = 'client';
  inviteCompany = '';

  loading = signal(false);
  successMessage = signal('');

  async inviteUser(e: Event) {
    e.preventDefault();
    if (!this.inviteEmail) return;

    this.loading.set(true);
    this.successMessage.set('');

    try {
      await this.dataService.inviteUser(this.inviteEmail, this.inviteRole, this.inviteCompany);
      this.successMessage.set(`Convite enviado para ${this.inviteEmail} com sucesso!`);
      this.inviteEmail = '';
      this.inviteCompany = '';
    } catch (err: any) {
      alert(err.message || 'Erro ao convidar usuário.');
    } finally {
      this.loading.set(false);
    }
  }
}
