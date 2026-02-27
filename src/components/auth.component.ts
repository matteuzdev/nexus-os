import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl p-8 relative z-10">
        
        <!-- Logo -->
        <div class="flex flex-col items-center mb-10">
          <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 transform -rotate-6">
            <span class="text-2xl font-black text-white">N</span>
          </div>
          <h2 class="text-3xl font-black text-white tracking-tighter">Nexus OS</h2>
          <p class="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Acesso Restrito</p>
        </div>

        <form (submit)="handleLogin($event)" class="space-y-6">
          @if (errorMessage()) {
            <div class="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold text-center animate-in fade-in">
              {{ errorMessage() }}
            </div>
          }

          <div>
            <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">E-mail Corporativo</label>
            <input type="email" [(ngModel)]="email" name="email" required
              class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors">
          </div>

          <div>
            <label class="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Senha</label>
            <input type="password" [(ngModel)]="password" name="password" required
              class="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-colors">
          </div>

          <button type="submit" [disabled]="loading()"
            class="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
            @if (loading()) {
              <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Autenticando...
            } @else {
              Entrar no Sistema
            }
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-zinc-800 text-center">
          <button (click)="back.emit()" class="text-xs text-zinc-500 hover:text-white transition-colors font-bold uppercase tracking-widest">
            ← Voltar para Konig Systems
          </button>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent {
  dataService = inject(DataService);
  back = output<void>();
  
  email = '';
  password = '';
  loading = signal(false);
  errorMessage = signal('');

  async handleLogin(e: Event) {
    e.preventDefault();
    if (!this.email || !this.password) return;

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await this.dataService.login(this.email, this.password);
      // DataService state automatically updates and AppComponent handles routing
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }
}
