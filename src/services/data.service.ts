import { Injectable, signal, computed, effect } from '@angular/core';

export type LifecycleStage = 'Ideação' | 'Validação' | 'Desenvolvimento' | 'Produção' | 'Manutenção';
export type TaskStatus = 'Backlog' | 'A Fazer' | 'Em Progresso' | 'Revisão' | 'Concluído';
export type TicketPriority = 'Baixa' | 'Média' | 'Alta' | 'Crítica';
export type TicketStatus = 'Aberto' | 'Em Análise' | 'Aguardando Dev' | 'Resolvido';
export type LeadStatus = 'Lead' | 'Qualificado' | 'Proposta' | 'Negociação' | 'Fechado' | 'Perdido';
export type SquadType = 'Growth' | 'Delivery' | 'Estratégia';

export interface Product {
  id: string;
  name: string;
  stage: LifecycleStage;
  version: string;
  revenue: number;
  nextAction: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: 'Feature' | 'Bug' | 'Automação' | 'Melhoria';
  points: number;
  status: TaskStatus;
  tag: string;
  linkedProductId?: string;
  originTicketId?: string; // Link back to support
}

export interface Ticket {
  id: string;
  client: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  linkedProductId: string;
  linkedTaskId?: string; // Link forward to dev
  createdAt: Date;
}

export interface Lead {
  id: string;
  company: string;
  contact: string;
  value: number;
  status: LeadStatus;
  source: string;
  lastContact: Date;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'Online' | 'Offline' | 'Busy';
  lastActivity: string;
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
  isPrivate: boolean; // True if only for Orion & CEO
}

export interface Lead {
  id: string;
  company: string;
  contact: string;
  email?: string;
  value: number;
  status: LeadStatus;
  source: string;
  lastContact: Date;
  // SDR Investigation Data
  investigation: {
    painPoints: string;
    techStack: string;
    budgetRange: string;
    decisionMaker: string;
    notes: string;
  };
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
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // --- STATE ---
  products = signal<Product[]>(this.load('products') || [
    { id: 'p1', name: 'Plataforma E-com AI', stage: 'Produção', version: 'v2.1.0', revenue: 15000, nextAction: 'Monitorar escala de servidores' },
    { id: 'p2', name: 'Bot de Atendimento Whats', stage: 'Desenvolvimento', version: 'v0.9.beta', revenue: 0, nextAction: 'Finalizar integração API Meta' },
  ]);

  tasks = signal<Task[]>(this.load('tasks') || [
    { 
      id: 't1', 
      title: 'Integrar API do Gemini', 
      description: 'Implementar o serviço de IA para triagem automática.',
      type: 'Feature', 
      points: 8, 
      status: 'Em Progresso', 
      tag: 'Dev AI', 
      linkedProductId: 'p1',
      comments: [{ id: 'c1', author: 'Orion', text: 'Iniciando o mapeamento dos endpoints.', timestamp: new Date() }]
    }
  ]);

  tickets = signal<Ticket[]>(this.load('tickets') || [
    { id: 'tk1', client: 'Empresa ABC', title: 'Erro ao gerar relatório PDF', description: 'O sistema trava quando tento exportar o relatório mensal.', priority: 'Alta', status: 'Aberto', linkedProductId: 'p1', createdAt: new Date() },
  ]);

  leads = signal<Lead[]>(this.load('leads') || [
    { 
      id: 'l1', 
      company: 'Tech Inovação', 
      contact: 'Marcos Silva', 
      value: 12000, 
      status: 'Lead', 
      source: 'Indicação', 
      lastContact: new Date(),
      investigation: {
        painPoints: 'Processos manuais no financeiro',
        techStack: 'Excel e papel',
        budgetRange: 'R$ 10k - 20k',
        decisionMaker: 'Marcos (CEO)',
        notes: 'Cliente muito interessado em automação com IA.'
      }
    }
  ]);

  squads = signal<Squad[]>(this.load('squads') || [
    {
      id: 's1',
      name: 'Squad Growth',
      type: 'Growth',
      kpi: 'Conversão de Leads',
      healthScore: 92,
      members: [
        { id: 'm1', name: 'Ana SDR', role: 'Closer', avatar: 'AS', status: 'Online', lastActivity: 'Investigando Lead "Startup X"' },
        { id: 'm2', name: 'Lucas CS', role: 'Account Manager', avatar: 'LC', status: 'Busy', lastActivity: 'Onboarding Indústria Prime' }
      ]
    },
    {
      id: 's2',
      name: 'Squad Delivery',
      type: 'Delivery',
      kpi: 'Sprint Velocity',
      healthScore: 88,
      members: [
        { id: 'm3', name: 'Orion (AI)', role: 'Dev Fullstack', avatar: 'O', status: 'Online', lastActivity: 'Codando Nexus Pro' }
      ]
    }
  ]);

  messages = signal<Message[]>(this.load('messages') || []);

  constructor() {
    effect(() => this.save('products', this.products()));
    effect(() => this.save('tasks', this.tasks()));
    effect(() => this.save('tickets', this.tickets()));
    effect(() => this.save('leads', this.leads()));
    effect(() => this.save('squads', this.squads()));
    effect(() => this.save('messages', this.messages()));
  }

  private save(key: string, data: any) {
    localStorage.setItem(`nexus_${key}`, JSON.stringify(data));
  }

  private load(key: string): any {
    const data = localStorage.getItem(`nexus_${key}`);
    if (!data) return null;
    try {
      const parsed = JSON.parse(data);
      if (key === 'messages' || key === 'tickets' || key === 'leads') {
        return parsed.map((item: any) => ({ ...item, timestamp: item.timestamp ? new Date(item.timestamp) : undefined, lastContact: item.lastContact ? new Date(item.lastContact) : undefined, createdAt: item.createdAt ? new Date(item.createdAt) : undefined }));
      }
      return parsed;
    } catch { return null; }
  }

  // --- CRUD: LEADS ---
  updateLead(lead: Lead) {
    this.leads.update(prev => prev.map(l => l.id === lead.id ? lead : l));
  }

  deleteLead(id: string) {
    this.leads.update(prev => prev.filter(l => l.id !== id));
  }

  addLead(lead: Omit<Lead, 'id' | 'lastContact'>) {
    const newId = 'l' + Date.now();
    this.leads.update(prev => [...prev, { ...lead, id: newId, lastContact: new Date() }]);
    return newId;
  }

  // --- CRUD: TASKS ---
  updateTask(task: Task) {
    this.tasks.update(prev => prev.map(t => t.id === task.id ? task : t));
  }

  addTask(task: Omit<Task, 'id' | 'comments'>) {
    const newId = 't' + Date.now();
    this.tasks.update(prev => [...prev, { ...task, id: newId, comments: [] }]);
    return newId;
  }

  addTaskComment(taskId: string, author: string, text: string) {
    const comment: TaskComment = { id: 'c' + Date.now(), author, text, timestamp: new Date() };
    this.tasks.update(prev => prev.map(t => t.id === taskId ? { ...t, comments: [...t.comments, comment] } : t));
  }

  // --- CRUD: PRODUCTS ---
  updateProduct(product: Product) {
    this.products.update(prev => prev.map(p => p.id === product.id ? product : p));
  }
  
  addProduct(product: Omit<Product, 'id'>) {
    const newId = 'p' + Date.now();
    this.products.update(prev => [...prev, { ...product, id: newId }]);
  }

  // --- ACTIONS ---
  moveLead(leadId: string, newStatus: LeadStatus) {
    const lead = this.leads().find(l => l.id === leadId);
    if (!lead) return;
    
    this.leads.update(leads => leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));

    if (newStatus === 'Fechado') {
      const newProductId = this.addProduct({
        name: `Projeto: ${lead.company}`,
        stage: 'Ideação',
        version: 'v0.1.0',
        revenue: lead.value,
        nextAction: 'Kickoff técnico'
      });
      // Logic for automatic task creation follows...
    }
  }

  moveTask(taskId: string, newStatus: TaskStatus) {
    this.tasks.update(tasks => tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  }

  getProductName(id: string): string {
    return this.products().find(p => p.id === id)?.name || 'Produto Desconhecido';
  }

  sendMessage(content: string, isPrivate: boolean = false) {
    const newMessage: Message = { id: 'msg' + Date.now(), senderId: isPrivate ? 'ceo' : 'm3', senderName: isPrivate ? 'Matteuz (CEO)' : 'Orion', content, timestamp: new Date(), isPrivate };
    this.messages.update(prev => [...prev, newMessage]);
  }
}  moveTask(taskId: string, newStatus: TaskStatus) {
    this.tasks.update(tasks => 
      tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    );
  }

  addTask(task: Omit<Task, 'id'>) {
    const newId = 't' + (this.tasks().length + 1 + Math.floor(Math.random() * 1000));
    this.tasks.update(prev => [...prev, { ...task, id: newId }]);
    return newId;
  }

  // --- ACTIONS: TICKETS ---
  addTicket(ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) {
    const newId = 'tk' + (this.tickets().length + 1 + Math.floor(Math.random() * 1000));
    this.tickets.update(prev => [
      { ...ticket, id: newId, status: 'Aberto', createdAt: new Date() },
      ...prev
    ]);
  }

  updateTicketStatus(id: string, status: TicketStatus) {
    this.tickets.update(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  }

  deleteTicket(id: string) {
    this.tickets.update(prev => prev.filter(t => t.id !== id));
  }

  // --- ACTIONS: INTERCONNECTION ---
  
  // Creates a Dev Task from a Support Ticket
  escalateTicketToDev(ticketId: string) {
    const ticket = this.tickets().find(t => t.id === ticketId);
    if (!ticket) return;

    // 1. Create the Task
    const newTaskId = this.addTask({
      title: `[Do Suporte] ${ticket.title}`,
      description: `Cliente: ${ticket.client}\nDescrição: ${ticket.description}`,
      type: 'Bug',
      points: 0, // Needs refining
      status: 'Backlog',
      tag: 'Suporte',
      linkedProductId: ticket.linkedProductId,
      originTicketId: ticket.id
    });

    // 2. Link Ticket to Task and Update Status
    this.tickets.update(prev => prev.map(t => 
      t.id === ticketId ? { ...t, status: 'Aguardando Dev', linkedTaskId: newTaskId } : t
    ));
  }

  getProductName(id: string): string {
    return this.products().find(p => p.id === id)?.name || 'Produto Desconhecido';
  }

  // --- ACTIONS: SALES ---
  moveLead(leadId: string, newStatus: LeadStatus) {
    this.leads.update(leads =>
      leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l)
    );

    // --- AUTOMAÇÃO DE VENDAS ---
    if (newStatus === 'Fechado') {
      const lead = this.leads().find(l => l.id === leadId);
      if (lead) {
        // 1. Cria o Produto/Projeto no Portfólio
        const newProductId = 'p' + (this.products().length + 1 + Math.floor(Math.random() * 1000));
        this.products.update(prev => [...prev, {
          id: newProductId,
          name: `Projeto: ${lead.company}`,
          stage: 'Ideação',
          version: 'v0.1.0',
          revenue: lead.value,
          nextAction: 'Realizar reunião de Kickoff técnica'
        }]);

        // 2. Cria a Tarefa de Onboarding no Kanban (Dev/Ops)
        this.addTask({
          title: `Setup Inicial & Kickoff: ${lead.company}`,
          description: `Contato: ${lead.contact}\nOrigem: ${lead.source}\nValor: R$ ${lead.value}`,
          type: 'Feature',
          points: 5,
          status: 'A Fazer',
          tag: 'Onboarding',
          linkedProductId: newProductId
        });

        // 3. Cria um Ticket de Boas-vindas no Suporte/CS
        this.addTicket({
          title: 'Onboarding de Novo Cliente',
          client: lead.company,
          description: `Novo contrato fechado com ${lead.contact}. Iniciar processo de boas-vindas e setup de acessos.`,
          priority: 'Alta',
          linkedProductId: newProductId
        });
      }
    }
  }

  addLead(lead: Omit<Lead, 'id' | 'lastContact'>) {
    const newId = 'l' + (this.leads().length + 1 + Math.floor(Math.random() * 1000));
    this.leads.update(prev => [...prev, { ...lead, id: newId, lastContact: new Date() }]);
  }

  addProduct(product: Omit<Product, 'id'>) {
    const newId = 'p' + (this.products().length + 1 + Math.floor(Math.random() * 1000));
    this.products.update(prev => [...prev, { ...product, id: newId }]);
  }

  clearAllData() {
    localStorage.clear();
    window.location.reload();
  }
}