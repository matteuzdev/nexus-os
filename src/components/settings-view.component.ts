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

        <!-- App Settings: Themes -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
          <h4 class="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">Aparência do Nexus OS</h4>
          <div class="space-y-4">
            <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Tema Global</p>
            <div class="grid grid-cols-2 gap-4">
              <button (click)="changeTheme('nexus-dark')" [class.border-indigo-500]="currentTheme === 'nexus-dark'" class="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-indigo-500/50 transition-all flex flex-col items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-zinc-900 border-2 border-indigo-500"></div>
                <span class="text-[10px] font-black text-white uppercase">Padrão</span>
              </button>
              <button (click)="changeTheme('neon-cyber')" [class.border-cyan-500]="currentTheme === 'neon-cyber'" class="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-cyan-500/50 transition-all flex flex-col items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-zinc-900 border-2 border-cyan-500"></div>
                <span class="text-[10px] font-black text-white uppercase">Cyberpunk</span>
              </button>
              <button (click)="changeTheme('emerald-city')" [class.border-emerald-500]="currentTheme === 'emerald-city'" class="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-emerald-500/50 transition-all flex flex-col items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-zinc-900 border-2 border-emerald-500"></div>
                <span class="text-[10px] font-black text-white uppercase">Forest</span>
              </button>
              <button (click)="changeTheme('ruby-red')" [class.border-rose-500]="currentTheme === 'ruby-red'" class="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-rose-500/50 transition-all flex flex-col items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-zinc-900 border-2 border-rose-500"></div>
                <span class="text-[10px] font-black text-white uppercase">Ruby</span>
              </button>
            </div>
          </div>
        </div>

        <!-- App Settings: Integrations -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
          <h4 class="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">Integrações (API)</h4>
          <form (submit)="saveIntegrations($event)" class="space-y-6">
            <div>
              <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 flex justify-between">
                <span>Resend API Key (E-mail)</span>
                @if (resendKey) { <span class="text-emerald-500">Conectado</span> }
              </label>
              <input type="password" [(ngModel)]="resendKey" name="resendKey" placeholder="re_..."
                class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors">
            </div>

            <div>
              <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 flex justify-between">
                <span>WhatsApp API Token</span>
                @if (waKey) { <span class="text-emerald-500">Conectado</span> }
              </label>
              <input type="password" [(ngModel)]="waKey" name="waKey" placeholder="EAA..."
                class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors">
            </div>

            <div class="pt-4 border-t border-zinc-800">
              <label class="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Model Context Protocol (MCP) Servers
              </label>
              <p class="text-[9px] text-zinc-500 mb-2 font-mono">URLs separadas por vírgula para fornecer contexto avançado aos Agentes (ex: WebMCP, Github MCP).</p>
              <textarea [(ngModel)]="mcpServers" name="mcpServers" rows="2" placeholder="http://localhost:3000/mcp, https://api.exemplo.com/mcp"
                class="w-full bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 text-xs text-indigo-200 focus:border-indigo-500 outline-none transition-colors resize-none font-mono"></textarea>
            </div>

            <button type="submit" [disabled]="loading()"
              class="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50">
              Salvar Integrações
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

  currentTheme = this.dataService.settings().theme;
  resendKey = this.dataService.settings().integrations.resendApiKey || '';
  waKey = this.dataService.settings().integrations.whatsappApiToken || '';

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

  changeTheme(theme: 'nexus-dark' | 'neon-cyber' | 'ruby-red' | 'emerald-city') {
    this.currentTheme = theme;
    const settings = this.dataService.settings();
    this.dataService.updateSettings({ ...settings, theme });
    this.successMessage.set('Tema aplicado. Atualize a página se necessário.');
    setTimeout(() => this.clearMessages(), 3000);
  }

  saveIntegrations(e: Event) {
    e.preventDefault();
    const settings = this.dataService.settings();
    this.dataService.updateSettings({
      ...settings,
      integrations: {
        ...settings.integrations,
        resendApiKey: this.resendKey,
        whatsappApiToken: this.waKey
      }
    });
    this.successMessage.set('Integrações salvas no sistema.');
    setTimeout(() => this.clearMessages(), 3000);
  }

  clearMessages() {
    this.successMessage.set('');
    this.errorMessage.set('');
  }
}
