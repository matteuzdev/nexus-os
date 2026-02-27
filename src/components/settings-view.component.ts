import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-settings-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-3xl mx-auto h-full overflow-y-auto custom-scrollbar pr-2 space-y-8">
      
      <header>
        <h3 class="text-3xl font-black text-white uppercase tracking-tighter">Meu Perfil</h3>
        <p class="text-xs font-mono text-zinc-500 mt-1">Gerencie suas credenciais e informações pessoais.</p>
      </header>

      @if (successMessage()) {
        <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold text-center animate-in fade-in">
          {{ successMessage() }}
        </div>
      }
      @if (errorMessage()) {
        <div class="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold text-center animate-in fade-in">
          {{ errorMessage() }}
        </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Profile Form -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
          <h4 class="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">Dados Pessoais</h4>
          <form (submit)="updateProfile($event)" class="space-y-6">
            <div>
              <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">E-mail (Login)</label>
              <input type="email" [value]="dataService.currentUser()?.email" disabled
                class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-500 outline-none cursor-not-allowed">
              <p class="text-[9px] text-zinc-600 mt-1">O e-mail não pode ser alterado por aqui.</p>
            </div>

            <div>
              <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Nome Completo</label>
              <input type="text" [(ngModel)]="fullName" name="fullName" required
                class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors">
            </div>

            <div>
              <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Telefone</label>
              <input type="text" [(ngModel)]="phone" name="phone"
                class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors">
            </div>

            <button type="submit" [disabled]="loading()"
              class="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50">
              Salvar Perfil
            </button>
          </form>
        </div>

        <!-- Password Form -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl h-fit">
          <h4 class="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">Segurança</h4>
          <form (submit)="updatePassword($event)" class="space-y-6">
            <div>
              <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Nova Senha</label>
              <input type="password" [(ngModel)]="newPassword" name="newPassword" required minlength="6"
                class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors">
            </div>

            <button type="submit" [disabled]="loading()"
              class="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-zinc-700 disabled:opacity-50">
              Atualizar Senha
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class SettingsViewComponent {
  dataService = inject(DataService);
  
  fullName = this.dataService.currentUser()?.user_metadata['full_name'] || '';
  phone = this.dataService.currentUser()?.user_metadata['phone'] || '';
  newPassword = '';

  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  async updateProfile(e: Event) {
    e.preventDefault();
    this.loading.set(true);
    this.clearMessages();
    try {
      await this.dataService.updateProfile(this.fullName, this.phone);
      this.successMessage.set('Perfil atualizado com sucesso!');
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Erro ao atualizar perfil.');
    } finally {
      this.loading.set(false);
    }
  }

  async updatePassword(e: Event) {
    e.preventDefault();
    if (this.newPassword.length < 6) {
      this.errorMessage.set('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    this.loading.set(true);
    this.clearMessages();
    try {
      await this.dataService.changePassword(this.newPassword);
      this.successMessage.set('Senha atualizada com sucesso!');
      this.newPassword = '';
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Erro ao atualizar senha.');
    } finally {
      this.loading.set(false);
    }
  }

  clearMessages() {
    this.successMessage.set('');
    this.errorMessage.set('');
  }
}
