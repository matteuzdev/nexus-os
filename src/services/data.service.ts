import { Injectable, signal, computed, effect } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export type LifecycleStage = 'Ideação' | 'Validação' | 'Desenvolvimento' | 'Produção' | 'Manutenção';
export type TaskStatus = 'Backlog' | 'A Fazer' | 'Em Progresso' | 'Revisão' | 'Concluído';
export type TicketPriority = 'Baixa' | 'Média' | 'Alta' | 'Crítica';
export type TicketStatus = 'Aberto' | 'Em Análise' | 'Aguardando Dev' | 'Resolvido';
export type LeadStatus = 'Prospecção' | 'Lead' | 'Qualificado' | 'Proposta' | 'Negociação' | 'Fechado' | 'Perdido';
export type SquadType = 'Growth' | 'Delivery' | 'Estratégia';

export interface Product { id: string; name: string; stage: LifecycleStage; version: string; revenue: number; nextAction: string; }
export interface Project { id: string; clientId: string; name: string; url: string; status: 'Planejamento' | 'Em Desenvolvimento' | 'Em Produção'; blueprint: string; createdAt: Date; }
export interface AppSettings { theme: 'nexus-dark' | 'neon-cyber' | 'ruby-red' | 'emerald-city'; integrations: { resendApiKey?: string; whatsappApiToken?: string; githubToken?: string; mcpServers?: string[]; telegramBotToken?: string; telegramChatId?: string; }; }
export interface NexusNotification { id: string; title: string; message: string; type: 'info' | 'success' | 'warning' | 'error'; timestamp: Date; read: boolean; }
export interface TaskComment { id: string; author: string; text: string; timestamp: Date; }
export interface Task { id: string; title: string; description: string; type: 'Feature' | 'Bug' | 'Automação' | 'Melhoria'; priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente'; points: number; status: TaskStatus; tag: string; category: string; stack: string; slaHours?: number; parentId?: string; linkedProjectId?: string; originTicketId?: string; comments: TaskComment[]; assignedTo?: string; deadline?: Date; }
export interface Ticket { id: string; client: string; title: string; description: string; priority: TicketPriority; status: TicketStatus; linkedProjectId: string; linkedTaskId?: string; createdAt: Date; reproductionSteps?: string; slaHours: number; clientEmail?: string; }
export interface PersonalTask { id: string; title: string; isCompleted: boolean; status: 'A Fazer' | 'Fazendo' | 'Concluído'; type: 'Meta' | 'Micro-tarefa' | 'Ideia Maluca'; createdAt: Date; }
export interface Lead { id: string; company: string; contact: string; email: string; phone: string; linkedin?: string; value: number; status: LeadStatus; source: string; lastContact: Date; investigation: { industry: string; companySize: string; painPoints: string; techStack: string; budgetRange: string; decisionMaker: string; notes: string; }; }
export interface Member { id: string; name: string; role: string; avatar: string; status: 'Online' | 'Offline' | 'Busy'; lastActivity: string; level: number; xp: number; }
export interface Squad { id: string; name: string; type: SquadType; members: Member[]; kpi: string; healthScore: number; }
export interface Message { id: string; senderId: string; senderName: string; content: string; timestamp: Date; isPrivate: boolean; }
export interface Client { id: string; name: string; email: string; company: string; status: 'Ativo' | 'Inativo' | 'Onboarding'; totalProjects: number; openTickets: number; lastActivity: Date; }

@Injectable({ providedIn: 'root' })
export class DataService {
  private supabase: SupabaseClient;
  currentUser = signal<User | null>(null);
  userRole = signal<'admin' | 'client' | null>(null);
  notifications = signal<NexusNotification[]>([]);
  unreadNotificationsCount = computed(() => this.notifications().filter(n => !n.read).length);
  products = signal<Product[]>([]);
  tasks = signal<Task[]>([]);
  tickets = signal<Ticket[]>([]);
  leads = signal<Lead[]>([]);
  personalTasks = signal<PersonalTask[]>([]);
  squads = signal<Squad[]>([]);
  messages = signal<Message[]>([]);
  clients = signal<Client[]>([]);
  projects = signal<Project[]>([]);
  settings = signal<AppSettings>({ theme: 'nexus-dark', integrations: {} });

  constructor() {
    this.supabase = createClient('https://qaxxorrgzdubxbckluzw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFheHhvcnJnemR1YnhiY2tsdXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNTQyMjIsImV4cCI6MjA4NzYzMDIyMn0.NtoEWhcdrm0n_dbNXsggYN-C9X4T4Ufi-spVMyBW6Oc');
    this.supabase.auth.getSession().then(({ data: { session } }) => this.handleAuthSession(session));
    this.supabase.auth.onAuthStateChange((_event, session) => this.handleAuthSession(session));
    this.loadSettings(); this.initializeData(); this.setupRealtime();
  }

  private loadSettings() { const saved = localStorage.getItem('nexus_settings'); if (saved) this.settings.set(JSON.parse(saved)); }
  updateSettings(newSettings: AppSettings) { this.settings.set(newSettings); localStorage.setItem('nexus_settings', JSON.stringify(newSettings)); document.body.className = `bg-zinc-950 text-zinc-100 h-screen overflow-hidden ${newSettings.theme}`; }
  private handleAuthSession(session: any) { if (session?.user) { this.currentUser.set(session.user); this.userRole.set((session.user.user_metadata?.['role'] || 'client') as any); } else { this.currentUser.set(null); this.userRole.set(null); } }
  
  async login(email: string, password: string) { const { data, error } = await this.supabase.auth.signInWithPassword({ email, password }); if (error) throw error; return data; }
  async logout() { await this.supabase.auth.signOut(); }
  async updateProfile(name: string, phone?: string, avatarUrl?: string) { const { data, error } = await this.supabase.auth.updateUser({ data: { full_name: name, phone, avatar_url: avatarUrl } }); if (error) throw error; return data; }
  async changePassword(password: string) { const { data, error } = await this.supabase.auth.updateUser({ password }); if (error) throw error; return data; }
  async inviteUser(email: string, role: 'admin' | 'client', companyName?: string) { console.log(`[Convite] ${email}`); return true; }

  private async initializeData() { await Promise.all([this.fetchLeads(), this.fetchProducts(), this.fetchTasks(), this.fetchTickets(), this.fetchMessages(), this.fetchPersonalTasks(), this.fetchSquads(), this.fetchClients(), this.fetchProjects()]); }
  private setupRealtime() { this.supabase.channel('nexus-changes').on('postgres_changes', { event: '*', schema: 'public' }, () => this.initializeData()).subscribe(); }

  private async fetchProjects() { const { data } = await this.supabase.from('projects').select('*').order('created_at', { ascending: false }); if (data) this.projects.set(data.map(p => ({ ...p, clientId: p.client_id, createdAt: new Date(p.created_at) }))); }
  private async fetchClients() { const { data } = await this.supabase.from('clients').select('*').order('company', { ascending: true }); if (data) this.clients.set(data.map(c => ({ ...c, lastActivity: new Date(c.last_activity), totalProjects: c.total_projects || 0, openTickets: c.open_tickets || 0 }))); }
  private async fetchLeads() { const { data } = await this.supabase.from('leads').select('*').order('created_at', { ascending: false }); if (data) this.leads.set(data.map(l => ({ ...l, lastContact: new Date(l.last_contact) }))); }
  private async fetchProducts() { const { data } = await this.supabase.from('products').select('*').order('created_at', { ascending: false }); if (data) this.products.set(data); }
  private async fetchTasks() { const { data } = await this.supabase.from('tasks').select('*').order('created_at', { ascending: false }); if (data) this.tasks.set(data.map(t => ({ ...t, deadline: t.deadline ? new Date(t.deadline) : undefined, linkedProjectId: t.linked_project_id, originTicketId: t.origin_ticket_id, assignedTo: t.assigned_to, comments: t.comments || [], priority: t.priority || 'Média', category: t.category || 'Geral', stack: t.stack || 'N/A' }))); }
  private async fetchTickets() { const { data } = await this.supabase.from('tickets').select('*').order('created_at', { ascending: false }); if (data) this.tickets.set(data.map(tk => ({ ...tk, createdAt: new Date(tk.created_at), linkedProjectId: tk.linked_project_id }))); }
  private async fetchMessages() { const { data } = await this.supabase.from('messages').select('*').order('timestamp', { ascending: true }); if (data) this.messages.set(data.map(m => ({ ...m, timestamp: new Date(m.timestamp) }))); }
  private async fetchPersonalTasks() { const { data } = await this.supabase.from('personal_tasks').select('*').order('created_at', { ascending: false }); if (data) this.personalTasks.set(data.map(pt => ({ ...pt, createdAt: new Date(pt.created_at), isCompleted: pt.is_completed, status: pt.status || (pt.is_completed ? 'Concluído' : 'A Fazer') }))); }
  private async fetchSquads() { const { data } = await this.supabase.from('squad_members').select('*'); if (data) this.squads.set([{ id: 's1', name: 'Squad Growth', type: 'Growth', kpi: 'Conversão', healthScore: 92, members: data.filter(m => ['m1', 'm2'].includes(m.id)) }, { id: 's2', name: 'Squad Delivery', type: 'Delivery', kpi: 'Velocity', healthScore: 88, members: data.filter(m => ['m3', 'm4'].includes(m.id)) }]); }

  pipelineValue = computed(() => this.leads().filter(l => l.status !== 'Fechado' && l.status !== 'Perdido').reduce((acc, l) => acc + l.value, 0));
  activeTasks = computed(() => this.tasks().filter(t => t.status === 'Em Progresso').length);
  openTickets = computed(() => this.tickets().filter(t => t.status !== 'Resolvido').length);

  async addTask(task: Partial<Task>) { await this.supabase.from('tasks').insert([{ title: task.title, description: task.description, type: task.type, points: task.points, status: task.status, tag: task.tag, linked_project_id: task.linkedProjectId, priority: task.priority || 'Média', category: task.category || 'Geral', stack: task.stack || 'N/A' }]); }
  async updateTask(task: Task) { await this.supabase.from('tasks').update({ title: task.title, description: task.description, status: task.status, priority: task.priority, category: task.category, stack: task.stack }).eq('id', task.id); }
  async moveTask(id: string, status: TaskStatus) { await this.supabase.from('tasks').update({ status }).eq('id', id); }
  async deleteTask(id: string) { await this.supabase.from('tasks').delete().eq('id', id); }
  async addTaskComment(id: string, author: string, text: string) { const task = this.tasks().find(t => t.id === id); if (task) await this.supabase.from('tasks').update({ comments: [...task.comments, { id: 'c'+Date.now(), author, text, timestamp: new Date() }] }).eq('id', id); }

  async addProject(project: Omit<Project, 'id' | 'createdAt'>) { await this.supabase.from('projects').insert([{ client_id: project.clientId, name: project.name, url: project.url, status: project.status, blueprint: project.blueprint }]); }
  async updateProject(project: Project) { await this.supabase.from('projects').update({ name: project.name, url: project.url, status: project.status, blueprint: project.blueprint }).eq('id', project.id); }
  async deleteProject(id: string) { await this.supabase.from('projects').delete().eq('id', id); }

  async addProduct(product: any) { await this.supabase.from('products').insert([product]); }
  async updateProduct(product: any) { await this.supabase.from('products').update(product).eq('id', product.id); }

  async addClient(client: any) { await this.supabase.from('clients').insert([client]); }
  async updateClient(client: any) { await this.supabase.from('clients').update(client).eq('id', client.id); }
  async deleteClient(id: string) { await this.supabase.from('clients').delete().eq('id', id); }

  async addLead(lead: any) { await this.supabase.from('leads').insert([lead]); }
  async updateLead(lead: any) { await this.supabase.from('leads').update(lead).eq('id', lead.id); }
  async deleteLead(id: string) { await this.supabase.from('leads').delete().eq('id', id); }

  async addPersonalTask(task: Partial<PersonalTask>) { await this.supabase.from('personal_tasks').insert([{ title: task.title, is_completed: false, status: 'A Fazer', type: task.type || 'Micro-tarefa' }]); }
  async updatePersonalTaskStatus(id: string, status: any) { await this.supabase.from('personal_tasks').update({ status, is_completed: status === 'Concluído' }).eq('id', id); }
  async deletePersonalTask(id: string) { await this.supabase.from('personal_tasks').delete().eq('id', id); }

  async sendMessage(content: string, senderName: string, isPrivate: boolean = false) { await this.supabase.from('messages').insert([{ sender_id: senderName.toLowerCase(), sender_name: senderName, content, is_private: isPrivate }]); }
  async notifyTeam(title: string, body: string) { this.addNotification(title, body, 'info'); const s = this.settings(); if (s.integrations.telegramBotToken && s.integrations.telegramChatId) { const prefix = title.includes('responding') ? title.replace(' responding...', '').toUpperCase() : 'NEXUS'; fetch(`https://api.telegram.org/bot${s.integrations.telegramBotToken}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: s.integrations.telegramChatId, text: `🤖 *${prefix}*\n\n${body}`, parse_mode: 'Markdown' }) }).catch(() => {}); } return true; }
  addNotification(title: string, message: string, type: any) { this.notifications.set([{ id: 'n'+Date.now(), title, message, type, timestamp: new Date(), read: false }, ...this.notifications()]); }
  markAllAsRead() { this.notifications.set(this.notifications().map(n => ({ ...n, read: true }))); }
  async addXP(memberId: string, amount: number) { const { data } = await this.supabase.from('squad_members').select('*').eq('id', memberId).single(); if (data) await this.supabase.from('squad_members').update({ xp: data.xp + amount, level: data.level + (data.xp + amount >= data.level * 1000 ? 1 : 0) }).eq('id', memberId); }

  async addTicketAndCheckClient(ticket: any) { const existing = this.clients().find(c => c.company.toLowerCase() === ticket.client.toLowerCase()); if (!existing) await this.addClient({ name: 'Contato via Chamado', email: ticket.clientEmail || '', company: ticket.client, status: 'Ativo' }); await this.supabase.from('tickets').insert([ticket]); }
  async updateTicketStatus(id: string, status: any) { await this.supabase.from('tickets').update({ status }).eq('id', id); }
  async escalateTicketToDev(id: string) { const ticket = this.tickets().find(t => t.id === id); if (ticket) await this.addTask({ title: `[BUG] ${ticket.title}`, description: ticket.description, status: 'A Fazer', type: 'Bug', linkedProjectId: ticket.linkedProjectId }); }

  async getSecret(name: string): Promise<string | null> { const { data } = await this.supabase.from('nexus_secrets').select('value').eq('name', name).single(); return data?.value || null; }
  hasIntegration(type: string): boolean { const s = this.settings().integrations; if (type === 'email') return !!s.resendApiKey; if (type === 'whatsapp') return !!s.whatsappApiToken; if (type === 'telegram') return !!s.telegramBotToken; return false; }
  getProjectName(id?: string) { return this.projects().find(p => p.id === id)?.name || 'N/A'; }
  clearAllData() { localStorage.clear(); window.location.reload(); }
}