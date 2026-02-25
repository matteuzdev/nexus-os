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
  reproductionSteps?: string; // Filled by QA
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
      email: 'marcos@techinova.com',
      phone: '(11) 98888-7777',
      value: 12000, 
      status: 'Lead', 
      source: 'Indicação', 
      lastContact: new Date(),
      investigation: {
        industry: 'Tecnologia',
        companySize: '10-50 funcionários',
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
      if (key === 'messages' || key === 'tickets' || key === 'leads' || key === 'tasks') {
        return parsed.map((item: any) => ({ 
          ...item, 
          timestamp: item.timestamp ? new Date(item.timestamp) : undefined, 
          lastContact: item.lastContact ? new Date(item.lastContact) : undefined, 
          createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
          comments: item.comments ? item.comments.map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) })) : []
        }));
      }
      return parsed;
    } catch { return null; }
  }

  // --- COMPUTED ---
  totalRevenue = computed(() => this.products().reduce((acc, p) => acc + p.revenue, 0));
  activeTasks = computed(() => this.tasks().filter(t => t.status === 'Em Progresso').length);
  openTickets = computed(() => this.tickets().filter(t => t.status !== 'Resolvido').length);
  pipelineValue = computed(() => this.leads()
    .filter(l => l.status !== 'Fechado' && l.status !== 'Perdido')
    .reduce((acc, l) => acc + l.value, 0)
  );

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
    return newId;
  }

  // --- ACTIONS: TICKETS ---
  addTicket(ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) {
    const newId = 'tk' + Date.now();
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

  escalateTicketToDev(ticketId: string) {
    const ticket = this.tickets().find(t => t.id === ticketId);
    if (!ticket) return;

    const newTaskId = this.addTask({
      title: `[Do Suporte] ${ticket.title}`,
      description: `Cliente: ${ticket.client}\nDescrição: ${ticket.description}`,
      type: 'Bug',
      points: 0,
      status: 'Backlog',
      tag: 'Suporte',
      linkedProductId: ticket.linkedProductId,
      originTicketId: ticket.id
    });

    this.tickets.update(prev => prev.map(t => 
      t.id === ticketId ? { ...t, status: 'Aguardando Dev', linkedTaskId: newTaskId } : t
    ));
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
      
      this.addTask({
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

  moveTask(taskId: string, newStatus: TaskStatus) {
    this.tasks.update(tasks => tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  }

  getProductName(id: string): string {
    return this.products().find(p => p.id === id)?.name || 'Produto Desconhecido';
  }

  sendMessage(content: string, senderName: string, isPrivate: boolean = false) {
    const newMessage: Message = { id: 'msg' + Date.now(), senderId: senderName.includes('CEO') ? 'ceo' : 'm3', senderName, content, timestamp: new Date(), isPrivate };
    this.messages.update(prev => [...prev, newMessage]);
  }

  clearAllData() {
    localStorage.clear();
    window.location.reload();
  }
}