import { Injectable, signal, computed, effect } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export type LifecycleStage = 'Ideação' | 'Validação' | 'Desenvolvimento' | 'Produção' | 'Manutenção';
export type TaskStatus = 'Backlog' | 'A Fazer' | 'Em Progresso' | 'Revisão' | 'Concluído';
export type TicketPriority = 'Baixa' | 'Média' | 'Alta' | 'Crítica';
export type TicketStatus = 'Aberto' | 'Em Análise' | 'Aguardando Dev' | 'Resolvido';
export type LeadStatus = 'Prospecção' | 'Lead' | 'Qualificado' | 'Proposta' | 'Negociação' | 'Fechado' | 'Perdido';
export type SquadType = 'Growth' | 'Delivery' | 'Estratégia';

export interface Product {
  id: string;
  name: string;
  stage: LifecycleStage;
  version: string;
  revenue: number;
  nextAction: string;
  blueprint?: string; // Mapa mental/técnico do sistema para os agentes
}

export interface TaskComment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'Feature' | 'Bug' | 'Automação' | 'Melhoria';
  points: number;
  status: TaskStatus;
  tag: string;
  linkedProductId?: string;
  originTicketId?: string;
  comments: TaskComment[];
  assignedTo?: string;
  deadline?: Date;
}

export interface Ticket {
  id: string;
  client: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  linkedProductId: string;
  linkedTaskId?: string;
  createdAt: Date;
  reproductionSteps?: string;
  slaHours: number;
  clientEmail?: string; // Link to client auth
}

export interface PersonalTask {
  id: string;
  title: string;
  isCompleted: boolean;
  status: 'A Fazer' | 'Fazendo' | 'Concluído';
  type: 'Meta' | 'Micro-tarefa' | 'Ideia Maluca';
  createdAt: Date;
}

export interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  linkedin?: string;
  value: number;
  status: LeadStatus;
  source: string;
  lastContact: Date;
  investigation: {
    industry: string;
    companySize: string;
    painPoints: string;
    techStack: string;
    budgetRange: string;
    decisionMaker: string;
    notes: string;
  };
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'Online' | 'Offline' | 'Busy';
  lastActivity: string;
  level: number;
  xp: number;
}

export interface Squad {
  id: string;
  name: string;
  type: SquadType;
  members: Member[];
  kpi: string;
  healthScore: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isPrivate: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'Ativo' | 'Inativo' | 'Onboarding';
  totalProjects: number;
  openTickets: number;
  lastActivity: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private supabase: SupabaseClient;

  // --- STATE ---
  currentUser = signal<User | null>(null);
  userRole = signal<'admin' | 'client' | null>(null);
  
  products = signal<Product[]>([]);
  tasks = signal<Task[]>([]);
  tickets = signal<Ticket[]>([]);
  leads = signal<Lead[]>([]);
  personalTasks = signal<PersonalTask[]>([]);
  squads = signal<Squad[]>([]);
  messages = signal<Message[]>([]);
  clients = signal<Client[]>([]);

  constructor() {
    const supabaseUrl = 'https://qaxxorrgzdubxbckluzw.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFheHhvcnJnemR1YnhiY2tsdXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNTQyMjIsImV4cCI6MjA4NzYzMDIyMn0.NtoEWhcdrm0n_dbNXsggYN-C9X4T4Ufi-spVMyBW6Oc';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
    
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.handleAuthSession(session);
    });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.handleAuthSession(session);
    });

    this.initializeData();
    this.setupRealtime();
  }

  private handleAuthSession(session: any) {
    if (session?.user) {
      this.currentUser.set(session.user);
      const role = session.user.user_metadata?.['role'] || 'client';
      this.userRole.set(role as 'admin' | 'client');
    } else {
      this.currentUser.set(null);
      this.userRole.set(null);
    }
  }

  // --- AUTH METHODS ---
  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async register(email: string, password: string, name: string, role: 'admin' | 'client' = 'client', companyName?: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role,
          company: companyName
        }
      }
    });
    if (error) throw error;
    return data;
  }

  async logout() {
    await this.supabase.auth.signOut();
  }

  async updateProfile(name: string, phone?: string) {
    const { data, error } = await this.supabase.auth.updateUser({
      data: { full_name: name, phone }
    });
    if (error) throw error;
    return data;
  }

  async changePassword(password: string) {
    const { data, error } = await this.supabase.auth.updateUser({ password });
    if (error) throw error;
    return data;
  }

  // Admin function to invite/create a user (Simulation for now without Service Role)
  // In production, this calls a Supabase Edge Function to create user securely.
  async inviteUser(email: string, role: 'admin' | 'client', companyName?: string) {
    // For MVP, we simulate invitation logic or use magic links.
    // Standard signUp logs out the current user, so we just log the intent.
    console.log(`[Automação] Convite enviado para ${email} (Role: ${role}). Empresa: ${companyName}`);
    // Ideally: await this.supabase.auth.signInWithOtp({ email, options: { data: { role, company: companyName } } });
    return true;
  }

  private async initializeData() {
    await Promise.all([
      this.fetchLeads(),
      this.fetchProducts(),
      this.fetchTasks(),
      this.fetchTickets(),
      this.fetchMessages(),
      this.fetchPersonalTasks(),
      this.fetchSquads(),
      this.fetchClients()
    ]);
  }

  private setupRealtime() {
    this.supabase
      .channel('nexus-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        this.initializeData();
      })
      .subscribe();
  }

  // --- FETCHERS ---
  private async fetchClients() {
    const { data } = await this.supabase.from('clients').select('*').order('company', { ascending: true });
    if (data) this.clients.set(data.map(c => ({ 
      ...c, 
      lastActivity: new Date(c.last_activity),
      totalProjects: c.total_projects || 0,
      openTickets: c.open_tickets || 0
    })));
  }
  private async fetchLeads() {
    const { data } = await this.supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (data) this.leads.set(data.map(l => ({ 
      ...l, 
      lastContact: new Date(l.last_contact),
      investigation: l.investigation
    })));
  }

  private async fetchProducts() {
    const { data } = await this.supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) {
      this.products.set(data.map(p => ({
        id: p.id,
        name: p.name,
        stage: p.stage,
        version: p.version,
        revenue: p.revenue,
        nextAction: p.next_action
      })));
    } else {
      this.seedProducts();
    }
  }

  private async seedProducts() {
    const defaultProducts = [
      { name: 'Landing Page High-Conversion', stage: 'Produção', version: 'v1.0.0', revenue: 2500, next_action: 'Otimizar SEO' },
      { name: 'Site Institucional Premium', stage: 'Desenvolvimento', version: 'v0.9.0', revenue: 5000, next_action: 'Finalizar seção de blog' },
      { name: 'Sistema com Agendamento', stage: 'Ideação', version: 'v0.1.0', revenue: 0, next_action: 'Modelar fluxo' },
      { name: 'Automação de Processos', stage: 'Validação', version: 'v0.5.0', revenue: 0, next_action: 'Integrar APIs' },
      { name: 'Agente de IA Corporativo', stage: 'Ideação', version: 'v0.1.0', revenue: 0, next_action: 'Prompt engineering' },
    ];
    await this.supabase.from('products').insert(defaultProducts);
    this.fetchProducts();
  }

  private async fetchTasks() {
    const { data } = await this.supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (data) this.tasks.set(data.map(t => ({ 
      ...t, 
      deadline: t.deadline ? new Date(t.deadline) : undefined,
      linkedProductId: t.linked_product_id,
      originTicketId: t.origin_ticket_id,
      assignedTo: t.assigned_to,
      comments: t.comments || [] 
    })));
  }

  private async fetchTickets() {
    const { data } = await this.supabase.from('tickets').select('*').order('created_at', { ascending: false });
    if (data) this.tickets.set(data.map(tk => ({ 
      ...tk, 
      createdAt: new Date(tk.created_at),
      linkedProductId: tk.linked_product_id,
      linkedTaskId: tk.linked_task_id,
      reproductionSteps: tk.reproduction_steps,
      slaHours: tk.sla_hours,
      clientEmail: tk.client_email
    })));
  }

  private async fetchMessages() {
    const { data } = await this.supabase.from('messages').select('*').order('timestamp', { ascending: true });
    if (data) this.messages.set(data.map(m => ({ 
      ...m, 
      senderId: m.sender_id,
      senderName: m.sender_name,
      timestamp: new Date(m.timestamp),
      isPrivate: m.is_private
    })));
  }

  private async fetchPersonalTasks() {
    const { data } = await this.supabase.from('personal_tasks').select('*').order('created_at', { ascending: false });
    if (data) this.personalTasks.set(data.map(pt => ({ 
      ...pt, 
      createdAt: new Date(pt.created_at),
      isCompleted: pt.is_completed
    })));
  }

  private async fetchSquads() {
    const { data } = await this.supabase.from('squad_members').select('*');
    if (data && data.length > 0) {
      this.squads.set([
        {
          id: 's1', name: 'Squad Growth', type: 'Growth', kpi: 'Conversão de Leads', healthScore: 92,
          members: data.filter(m => ['m1', 'm2'].includes(m.id)).map(m => ({ ...m, lastActivity: m.last_activity }))
        },
        {
          id: 's2', name: 'Squad Delivery', type: 'Delivery', kpi: 'Sprint Velocity', healthScore: 88,
          members: data.filter(m => ['m3', 'm4'].includes(m.id)).map(m => ({ ...m, lastActivity: m.last_activity }))
        }
      ]);
    } else {
      this.seedSquads();
    }
  }

  private async seedSquads() {
    const initialMembers = [
      { id: 'm1', name: 'Ana SDR', role: 'Closer', avatar: 'AS', status: 'Online', last_activity: 'Prospectando no LinkedIn', level: 4, xp: 450 },
      { id: 'm2', name: 'Lucas CS', role: 'Account Manager', avatar: 'LC', status: 'Busy', last_activity: 'Nutrindo Leads', level: 3, xp: 320 },
      { id: 'm3', name: 'Orion (AI)', role: 'Dev Fullstack', avatar: 'O', status: 'Online', last_activity: 'Codando V2.0', level: 10, xp: 5000 },
      { id: 'm4', name: 'Carla QA', role: 'Quality Assurance', avatar: 'CQ', status: 'Offline', last_activity: 'Homologando Automação', level: 5, xp: 800 }
    ];
    await this.supabase.from('squad_members').insert(initialMembers);
    this.fetchSquads();
  }

  // --- COMPUTED ---
  totalRevenue = computed(() => this.products().reduce((acc, p) => acc + p.revenue, 0));
  activeTasks = computed(() => this.tasks().filter(t => t.status === 'Em Progresso').length);
  openTickets = computed(() => this.tickets().filter(t => t.status !== 'Resolvido').length);
  pipelineValue = computed(() => this.leads()
    .filter(l => l.status !== 'Fechado' && l.status !== 'Perdido')
    .reduce((acc, l) => acc + l.value, 0)
  );

  // --- CRUD: PERSONAL TASKS ---
  async addPersonalTask(task: Partial<PersonalTask>) {
    await this.supabase.from('personal_tasks').insert([{
      title: task.title,
      is_completed: task.isCompleted || false,
      status: task.status || 'A Fazer',
      type: task.type || 'Micro-tarefa'
    }]);
  }

  async togglePersonalTask(id: string) {
    const task = this.personalTasks().find(t => t.id === id);
    if (task) {
      await this.supabase.from('personal_tasks').update({ is_completed: !task.isCompleted }).eq('id', id);
    }
  }

  async deletePersonalTask(id: string) {
    await this.supabase.from('personal_tasks').delete().eq('id', id);
  }

  async updatePersonalTaskStatus(id: string, status: 'A Fazer' | 'Fazendo' | 'Concluído') {
    const isCompleted = status === 'Concluído';
    await this.supabase.from('personal_tasks').update({ 
      status, 
      is_completed: isCompleted 
    }).eq('id', id);
  }

  // --- CRUD: LEADS ---
  async updateLead(lead: Lead) {
    const { id, ...updateData } = lead;
    await this.supabase.from('leads').update({
      company: updateData.company,
      contact: updateData.contact,
      email: updateData.email,
      phone: updateData.phone,
      linkedin: updateData.linkedin,
      value: updateData.value,
      status: updateData.status,
      source: updateData.source,
      investigation: updateData.investigation
    }).eq('id', id);
  }

  async deleteLead(id: string) {
    await this.supabase.from('leads').delete().eq('id', id);
  }

  async addLead(lead: Omit<Lead, 'id' | 'lastContact'>) {
    const { data } = await this.supabase.from('leads').insert([{
      company: lead.company,
      contact: lead.contact,
      email: lead.email,
      phone: lead.phone,
      linkedin: lead.linkedin,
      value: lead.value,
      status: lead.status,
      source: lead.source,
      investigation: lead.investigation
    }]).select();
    return data ? data[0].id : null;
  }

  // --- CRUD: TASKS ---
  async updateTask(task: Task) {
    const { id, ...updateData } = task;
    await this.supabase.from('tasks').update({
      title: updateData.title,
      description: updateData.description,
      type: updateData.type,
      points: updateData.points,
      status: updateData.status,
      tag: updateData.tag,
      linked_product_id: updateData.linkedProductId,
      origin_ticket_id: updateData.originTicketId,
      assigned_to: updateData.assignedTo,
      deadline: updateData.deadline,
      comments: updateData.comments
    }).eq('id', id);
  }

  async addTask(task: Omit<Task, 'id' | 'comments'>) {
    const { data } = await this.supabase.from('tasks').insert([{
      title: task.title,
      description: task.description,
      type: task.type,
      points: task.points,
      status: task.status,
      tag: task.tag,
      linked_product_id: task.linkedProductId,
      origin_ticket_id: task.originTicketId,
      assigned_to: task.assignedTo,
      deadline: task.deadline
    }]).select();
    return data ? data[0].id : null;
  }

  async addTaskComment(taskId: string, author: string, text: string) {
    const task = this.tasks().find(t => t.id === taskId);
    if (task) {
      const newComment = { id: 'c' + Date.now(), author, text, timestamp: new Date() };
      await this.supabase.from('tasks').update({ 
        comments: [...task.comments, newComment] 
      }).eq('id', taskId);
    }
  }

  async deleteTask(id: string) {
    await this.supabase.from('tasks').delete().eq('id', id);
  }

  // --- CRUD: PRODUCTS ---
  async updateProduct(product: Product) {
    const { id, ...updateData } = product;
    await this.supabase.from('products').update({
      name: updateData.name,
      stage: updateData.stage,
      version: updateData.version,
      revenue: updateData.revenue,
      next_action: updateData.nextAction
    }).eq('id', id);
  }
  
  async addProduct(product: Omit<Product, 'id'>) {
    const { data } = await this.supabase.from('products').insert([{
      name: product.name,
      stage: product.stage,
      version: product.version,
      revenue: product.revenue,
      next_action: product.nextAction
    }]).select();
    return data ? data[0].id : null;
  }

  // --- CRUD: TICKETS ---
  async addTicket(ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) {
    await this.supabase.from('tickets').insert([{
      title: ticket.title,
      client: ticket.client,
      description: ticket.description,
      priority: ticket.priority,
      linked_product_id: ticket.linkedProductId,
      sla_hours: ticket.slaHours,
      client_email: ticket.clientEmail
    }]);
  }

  async updateTicketStatus(id: string, status: TicketStatus) {
    await this.supabase.from('tickets').update({ status }).eq('id', id);
  }

  async deleteTicket(id: string) {
    await this.supabase.from('tickets').delete().eq('id', id);
  }

  async escalateTicketToDev(ticketId: string) {
    const ticket = this.tickets().find(t => t.id === ticketId);
    if (!ticket) return;

    const newTaskId = await this.addTask({
      title: `[Do Suporte] ${ticket.title}`,
      description: `Cliente: ${ticket.client}\nDescrição: ${ticket.description}\nPassos p/ Reproduzir: ${ticket.reproductionSteps || 'N/A'}`,
      type: 'Bug',
      points: 2,
      status: 'A Fazer',
      tag: 'Suporte',
      linkedProductId: ticket.linkedProductId,
      originTicketId: ticket.id,
      deadline: new Date(new Date().getTime() + (ticket.slaHours * 3600000))
    });

    if (newTaskId) {
      await this.supabase.from('tickets').update({ 
        status: 'Aguardando Dev', 
        linked_task_id: newTaskId 
      }).eq('id', ticketId);
    }
  }

  // --- ACTIONS ---
  async moveLead(leadId: string, newStatus: LeadStatus) {
    await this.supabase.from('leads').update({ status: newStatus }).eq('id', leadId);

    if (newStatus === 'Fechado') {
      const lead = this.leads().find(l => l.id === leadId);
      if (lead) {
        const newProductId = await this.addProduct({
          name: `Projeto: ${lead.company}`,
          stage: 'Ideação',
          version: 'v0.1.0',
          revenue: lead.value,
          nextAction: 'Kickoff técnico'
        });
        
        if (newProductId) {
          await this.addTask({
            title: `Setup Inicial & Kickoff: ${lead.company}`,
            description: `Dossiê: ${lead.investigation.notes}`,
            type: 'Feature',
            points: 5,
            status: 'A Fazer',
            tag: 'Onboarding',
            linkedProductId: newProductId
          });
        }
      }
    }
  }

  async moveTask(taskId: string, newStatus: TaskStatus) {
    await this.supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
  }

  getProductName(id: string): string {
    return this.products().find(p => p.id === id)?.name || 'Produto Desconhecido';
  }

  async sendMessage(content: string, senderName: string, isPrivate: boolean = false) {
    const senderId = senderName.includes('CEO') ? 'ceo' : senderName.toLowerCase().replace(' ', '');
    await this.supabase.from('messages').insert([{
      sender_id: senderId,
      sender_name: senderName,
      content,
      is_private: isPrivate
    }]);
  }

  /**
   * Envia notificações importantes (leads, convites, alertas) diretamente para o GitHub
   * via GitHub Issues/Events (simulando disparo de e-mail para o time)
   */
  async notifyTeam(title: string, body: string) {
    console.log(`[GitHub Notification] ${title}: ${body}`);
    // No futuro, aqui chamamos a API do GitHub para criar uma Issue automática
    // fetch('https://api.github.com/repos/matteuzdev/nexus-os/issues', { ... })
    await this.sendMessage(`[NOTIFICAÇÃO SISTEMA] ${title}. Ver detalhes no repositório.`, 'Nexus System', true);
    return true;
  }

  async addXP(memberId: string, amount: number) {
    const { data } = await this.supabase.from('squad_members').select('*').eq('id', memberId).single();
    if (data) {
      let newXp = data.xp + amount;
      let newLevel = data.level;
      if (newXp >= newLevel * 1000) {
        newLevel++;
      }
      await this.supabase.from('squad_members').update({ xp: newXp, level: newLevel }).eq('id', memberId);
    }
  }

  async clearAllData() {
    localStorage.clear();
    window.location.reload();
  }

  // --- CRUD: CLIENTS ---
  async addClient(client: Omit<Client, 'id' | 'lastActivity' | 'totalProjects' | 'openTickets'>) {
    await this.supabase.from('clients').insert([{
      name: client.name,
      email: client.email,
      company: client.company,
      status: client.status || 'Onboarding',
      last_activity: new Date()
    }]);
  }

  async updateClient(client: Client) {
    const { id, ...data } = client;
    await this.supabase.from('clients').update({
      name: data.name,
      email: data.email,
      company: data.company,
      status: data.status,
      last_activity: new Date()
    }).eq('id', id);
  }

  async deleteClient(id: string) {
    await this.supabase.from('clients').delete().eq('id', id);
  }

  // Sobrescrita do addTicket para incluir auto-criação de cliente
  async addTicketAndCheckClient(ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) {
    const existingClient = this.clients().find(c => c.company.toLowerCase() === ticket.client.toLowerCase());
    if (!existingClient) {
      await this.addClient({
        name: 'Contato via Chamado',
        email: ticket.clientEmail || '',
        company: ticket.client,
        status: 'Ativo'
      });
    }
    await this.addTicket(ticket);
  }
}
