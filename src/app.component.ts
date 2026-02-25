import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardViewComponent } from './components/dashboard-view.component';
import { PortfolioViewComponent } from './components/portfolio-view.component';
import { KanbanViewComponent } from './components/kanban-view.component';
import { SupportViewComponent } from './components/support-view.component';
import { PublicWebsiteComponent } from './components/public-website.component';
import { SalesViewComponent } from './components/sales-view.component';
import { SquadsViewComponent } from './components/squads-view.component';

type View = 'public' | 'dashboard' | 'portfolio' | 'kanban' | 'support' | 'sales' | 'squads';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    DashboardViewComponent, 
    PortfolioViewComponent, 
    KanbanViewComponent, 
    SupportViewComponent,
    PublicWebsiteComponent,
    SalesViewComponent,
    SquadsViewComponent
  ],
  template: `
    @if (currentView() === 'public') {
      <app-public-website (login)="currentView.set('dashboard')"></app-public-website>
    } @else {
      <div class="flex h-screen bg-zinc-950 text-white font-sans selection:bg-indigo-500/30">
        
        <!-- Main Sidebar -->
        <aside class="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
          <!-- Brand -->
          <div class="p-6 flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 flex items-center justify-center font-bold text-white">
              N
            </div>
            <div>
              <h1 class="font-bold text-lg leading-tight">Nexus OS</h1>
              <p class="text-[10px] text-zinc-500 uppercase tracking-widest">Internal Core</p>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 px-3 space-y-1 mt-4">
            <button (click)="currentView.set('dashboard')" 
              class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              [class]="currentView() === 'dashboard' ? 'bg-zinc-800 text-white shadow-inner' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Visão Geral
            </button>

            <button (click)="currentView.set('sales')" 
              class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              [class]="currentView() === 'sales' ? 'bg-zinc-800 text-white shadow-inner' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Vendas / CRM
            </button>

            <button (click)="currentView.set('squads')" 
              class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              [class]="currentView() === 'squads' ? 'bg-zinc-800 text-white shadow-inner' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Squads & Chat
            </button>

            <button (click)="currentView.set('kanban')" 
              class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              [class]="currentView() === 'kanban' ? 'bg-zinc-800 text-white shadow-inner' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
              Desenvolvimento
            </button>

            <button (click)="currentView.set('support')" 
              class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              [class]="currentView() === 'support' ? 'bg-zinc-800 text-white shadow-inner' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Suporte & Chamados
            </button>

            <button (click)="currentView.set('portfolio')" 
              class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              [class]="currentView() === 'portfolio' ? 'bg-zinc-800 text-white shadow-inner' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              Portfólio
            </button>
          </nav>

          <!-- User Profile & Exit -->
          <div class="p-4 border-t border-zinc-800 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700"></div>
              <div class="flex flex-col">
                <span class="text-xs font-bold text-white">Admin</span>
                <span class="text-[10px] text-zinc-500">nexus@owner.com</span>
              </div>
            </div>
            <button (click)="currentView.set('public')" class="w-full text-xs text-zinc-500 hover:text-zinc-300 py-2 border border-zinc-800 hover:bg-zinc-800 rounded transition-colors flex items-center justify-center gap-2">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sair / Ir para Site
            </button>
          </div>
        </aside>

        <!-- Content Area -->
        <main class="flex-1 overflow-hidden flex flex-col bg-zinc-950 relative">
          <!-- Top Bar -->
          <header class="h-16 border-b border-zinc-800 flex items-center justify-between px-8 shrink-0 bg-zinc-950/50 backdrop-blur-sm z-10">
            <h2 class="text-xl font-semibold text-white tracking-tight">
              @switch (currentView()) {
                @case ('dashboard') { Visão Geral }
                @case ('sales') { Funil de Vendas & CRM }
                @case ('squads') { Gestão de Squads & Nexus Hub }
                @case ('portfolio') { Portfólio de Produtos }
                @case ('kanban') { Board de Desenvolvimento }
                @case ('support') { Central de Suporte }
              }
            </h2>
            <div class="flex items-center gap-4">
               <span class="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                 <span class="relative flex h-2 w-2">
                   <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                   <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                 </span>
                 System Online
               </span>
            </div>
          </header>

          <!-- Views -->
          <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
            @switch (currentView()) {
              @case ('dashboard') { <app-dashboard-view class="animate-in fade-in slide-in-from-bottom-2 duration-500"/> }
              @case ('sales') { <app-sales-view class="h-full block animate-in fade-in slide-in-from-bottom-2 duration-500"/> }
              @case ('squads') { <app-squads-view class="h-full block animate-in fade-in slide-in-from-bottom-2 duration-500"/> }
              @case ('portfolio') { <app-portfolio-view class="animate-in fade-in slide-in-from-bottom-2 duration-500"/> }
              @case ('kanban') { <app-kanban-view class="h-full block animate-in fade-in slide-in-from-bottom-2 duration-500"/> }
              @case ('support') { <app-support-view class="h-full block animate-in fade-in slide-in-from-bottom-2 duration-500"/> }
            }
          </div>
        </main>
      </div>
    }
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
  `]
})
export class AppComponent {
  currentView = signal<View>('public'); // Defaults to public site
}