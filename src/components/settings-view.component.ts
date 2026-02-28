import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-settings-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-5xl mx-auto h-full overflow-y-auto custom-scrollbar pr-2 space-y-10 pb-20">
      
      <header>
        <h3 class="text-3xl font-black text-white uppercase tracking-tighter">Configurações Master</h3>
        <p class="text-xs font-mono text-zinc-500 mt-1">Orquestração de identidade, aparência e conexões neurais.</p>
      </header>

      @if (successMessage()) {
        <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold text-center animate-in fade-in">
          {{ successMessage() }}
        </div>
      }

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Tab Identity -->
        <div class="lg:col-span-1 space-y-8">
          <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
            <h4 class="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">Identidade CEO</h4>
            <form (submit)="updateProfile($event)" class="space-y-6">
              <div class="flex justify-center mb-6">
                 <div class="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden flex items-center justify-center relative group">
                   @if (avatarUrl) {
                     <img [src]="avatarUrl" class="w-full h-full object-cover">
                   } @else {
                     <span class="text-2xl font-black text-zinc-600">{{ fullName.substring(0,1) }}</span>
                   }
                   <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px] font-black text-white uppercase text-center p-2">Alterar URL abaixo</div>
                 </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Nome Completo</label>
                <input type="text" [(ngModel)]="fullName" name="fullName" required
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors">
              </div>

              <div>
                <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 text-indigo-400">URL da Foto (Avatar)</label>
                <input type="text" [(ngModel)]="avatarUrl" name="avatarUrl" placeholder="https://imgur.com/..."
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors text-xs font-mono">
              </div>

              <button type="submit" [disabled]="loading()"
                class="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20">
                Salvar Identidade
              </button>
            </form>
          </div>

          <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
            <h4 class="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">Segurança</h4>
            <form (submit)="updatePassword($event)" class="space-y-6">
              <div>
                <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Nova Senha</label>
                <input type="password" [(ngModel)]="newPassword" name="newPassword" required minlength="6"
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors">
              </div>
              <button type="submit" [disabled]="loading()" class="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-zinc-700">Atualizar Senha</button>
            </form>
          </div>
        </div>

        <!-- Tab Appearance & Integrations -->
        <div class="lg:col-span-2 space-y-8">
          
          <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
            <h4 class="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">Personalização Visual</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button (click)="changeTheme('nexus-dark')" [class.ring-2.ring-indigo-500]="currentTheme === 'nexus-dark'" class="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:bg-zinc-900 transition-all flex flex-col items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-zinc-900 border-4 border-zinc-800"></div>
                <span class="text-[10px] font-black text-white uppercase tracking-tighter">Nexus Dark</span>
              </button>
              <button (click)="changeTheme('neon-cyber')" [class.ring-2.ring-cyan-500]="currentTheme === 'neon-cyber'" class="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:bg-zinc-900 transition-all flex flex-col items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-zinc-900 border-4 border-cyan-500"></div>
                <span class="text-[10px] font-black text-white uppercase tracking-tighter">Cyberpunk</span>
              </button>
              <button (click)="changeTheme('ruby-red')" [class.ring-2.ring-rose-500]="currentTheme === 'ruby-red'" class="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:bg-zinc-900 transition-all flex flex-col items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-zinc-900 border-4 border-rose-500"></div>
                <span class="text-[10px] font-black text-white uppercase tracking-tighter">Ruby Red</span>
              </button>
              <button (click)="changeTheme('emerald-city')" [class.ring-2.ring-emerald-500]="currentTheme === 'emerald-city'" class="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:bg-zinc-900 transition-all flex flex-col items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-zinc-900 border-4 border-emerald-500"></div>
                <span class="text-[10px] font-black text-white uppercase tracking-tighter">Emerald</span>
              </button>
            </div>
          </div>

          <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
            <div class="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
              <h4 class="text-sm font-black text-white uppercase tracking-widest">Ponte de Integrações</h4>
              <div class="flex gap-2">
                <span class="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[8px] font-black rounded uppercase border border-indigo-500/20">MCP Ready</span>
                <span class="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[8px] font-black rounded uppercase border border-blue-500/20">Telegram Live</span>
              </div>
            </div>
            
            <form (submit)="saveIntegrations($event)" class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Resend API (E-mail)</label>
                  <input type="password" [(ngModel)]="resendKey" name="resendKey" placeholder="re_..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors text-xs font-mono">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">WhatsApp Token</label>
                  <input type="password" [(ngModel)]="waKey" name="waKey" placeholder="EAA..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors text-xs font-mono">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl relative">
                <div class="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-blue-500/20 rounded-lg">
                   <div class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                   <span class="text-[8px] font-black text-blue-400 uppercase">Telegram Hub</span>
                </div>
                <div>
                  <label class="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Bot Token</label>
                  <input type="password" [(ngModel)]="tgToken" name="tgToken" placeholder="78...:AAF..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors text-xs font-mono">
                </div>
                <div>
                  <label class="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Chat ID (Grupo)</label>
                  <input type="text" [(ngModel)]="tgChatId" name="tgChatId" placeholder="-100..." class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors text-xs font-mono">
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Servidores MCP (URLs de Contexto)
                </label>
                <textarea [(ngModel)]="mcpServers" name="mcpServers" rows="2" placeholder="http://localhost:3000/mcp, https://github-mcp.vercel.app" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300 focus:border-emerald-500 outline-none transition-colors resize-none font-mono"></textarea>
              </div>

              <button type="submit" [disabled]="loading()"
                class="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-3">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Consolidar Todas as Integrações
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  `
})
export class SettingsViewComponent {
  dataService = inject(DataService);
  
  fullName = this.dataService.currentUser()?.user_metadata['full_name'] || '';
  phone = this.dataService.currentUser()?.user_metadata['phone'] || '';
  avatarUrl = this.dataService.currentUser()?.user_metadata['avatar_url'] || '';
  newPassword = '';

  currentTheme = this.dataService.settings().theme;
  resendKey = this.dataService.settings().integrations.resendApiKey || '';
  tgToken = this.dataService.settings().integrations.telegramBotToken || '';
  tgChatId = this.dataService.settings().integrations.telegramChatId || '';
  mcpServers = (this.dataService.settings().integrations.mcpServers || []).join(', ');

  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  async updateProfile(e: Event) {
    e.preventDefault();
    this.loading.set(true);
    try {
      await this.dataService.updateProfile(this.fullName, this.phone, this.avatarUrl);
      this.successMessage.set('Perfil atualizado com sucesso!');
      setTimeout(() => this.successMessage.set(''), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      this.loading.set(false);
    }
  }

  async updatePassword(e: Event) {
    e.preventDefault();
    if (this.newPassword.length < 6) return;
    this.loading.set(true);
    try {
      await this.dataService.changePassword(this.newPassword);
      this.successMessage.set('Senha atualizada!');
      this.newPassword = '';
      setTimeout(() => this.successMessage.set(''), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      this.loading.set(false);
    }
  }

  changeTheme(theme: any) {
    this.currentTheme = theme;
    const settings = this.dataService.settings();
    this.dataService.updateSettings({ ...settings, theme });
    this.successMessage.set('Tema visual orquestrado!');
    setTimeout(() => this.successMessage.set(''), 3000);
  }

  saveIntegrations(e: Event) {
    e.preventDefault();
    const settings = this.dataService.settings();
    const mcpArray = this.mcpServers.split(',').map(s => s.trim()).filter(s => s);
    
    this.dataService.updateSettings({
      ...settings,
      integrations: {
        ...settings.integrations,
        resendApiKey: this.resendKey,
        whatsappApiToken: this.waKey,
        telegramBotToken: this.tgToken,
        telegramChatId: this.tgChatId,
        mcpServers: mcpArray
      }
    });
    this.successMessage.set('Conexões neurais sincronizadas!');
    setTimeout(() => this.successMessage.set(''), 3000);
  }
}