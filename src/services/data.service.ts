import { Injectable, signal, computed, effect } from '@angular/core';

export type LifecycleStage = 'Ideação' | 'Validação' | 'Desenvolvimento' | 'Produção' | 'Manutenção';
export type TaskStatus = 'Backlog' | 'A Fazer' | 'Em Progresso' | 'Revisão' | 'Concluído';
export type TicketPriority = 'Baixa' | 'Média' | 'Alta' | 'Crítica';
export type TicketStatus = 'Aberto' | 'Em Análise' | 'Aguardando Dev' | 'Resolvido';
export type LeadStatus = 'Lead' | 'Qualificado' | 'Proposta' | 'Negociação' | 'Fechado' | 'Perdido';

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

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // --- STATE ---
  products = signal<Product[]>(this.load('products') || [
    { id: 'p1', name: 'Plataforma E-com AI', stage: 'Produção', version: 'v2.1.0', revenue: 15000, nextAction: 'Monitorar escala de servidores' },
    { id: 'p2', name: 'Bot de Atendimento Whats', stage: 'Desenvolvimento', version: 'v0.9.beta', revenue: 0, nextAction: 'Finalizar integração API Meta' },
    { id: 'p3', name: 'Painel Admin Interno', stage: 'Manutenção', version: 'v1.0.4', revenue: 0, nextAction: 'Patch de segurança mensal' },
    { id: 'p4', name: 'SaaS de Geração de Leads', stage: 'Ideação', version: '-', revenue: 0, nextAction: 'Validar PMF com 10 clientes' },
  ]);

  tasks = signal<Task[]>(this.load('tasks') || [
    { id: 't1', title: 'Integrar API do Gemini', type: 'Feature', points: 8, status: 'Em Progresso', tag: 'Dev AI', linkedProductId: 'p1' },
    { id: 't2', title: 'Corrigir timeout no login', type: 'Bug', points: 3, status: 'A Fazer', tag: 'Hotfix', linkedProductId: 'p1' },
    { id: 't3', title: 'Automação de Notas Fiscais', type: 'Automação', points: 5, status: 'Backlog', tag: 'Ops', linkedProductId: 'p3' },
  ]);

  tickets = signal<Ticket[]>(this.load('tickets') || [
    { id: 'tk1', client: 'Empresa ABC', title: 'Erro ao gerar relatório PDF', description: 'O sistema trava quando tento exportar o relatório mensal.', priority: 'Alta', status: 'Aberto', linkedProductId: 'p1', createdAt: new Date() },
    { id: 'tk2', client: 'Loja Exemplo', title: 'Dúvida sobre configuração', description: 'Como altero a mensagem de boas vindas?', priority: 'Baixa', status: 'Resolvido', linkedProductId: 'p2', createdAt: new Date() },
  ]);

  leads = signal<Lead[]>(this.load('leads') || [
    { id: 'l1', company: 'Tech Inovação', contact: 'Marcos Silva', value: 12000, status: 'Lead', source: 'Indicação', lastContact: new Date() },
    { id: 'l2', company: 'Global Logística', contact: 'Ana Clara', value: 45000, status: 'Proposta', source: 'Ads', lastContact: new Date() },
    { id: 'l3', company: 'Startup X', contact: 'Felipe G.', value: 8500, status: 'Negociação', source: 'LinkedIn', lastContact: new Date() },
    { id: 'l4', company: 'Indústria Prime', contact: 'Roberto', value: 25000, status: 'Fechado', source: 'Evento', lastContact: new Date() },
  ]);

  constructor() {
    // Auto-sync to LocalStorage
    effect(() => this.save('products', this.products()));
    effect(() => this.save('tasks', this.tasks()));
    effect(() => this.save('tickets', this.tickets()));
    effect(() => this.save('leads', this.leads()));
  }

  private save(key: string, data: any) {
    localStorage.setItem(`nexus_${key}`, JSON.stringify(data));
  }

  private load(key: string): any {
    const data = localStorage.getItem(`nexus_${key}`);
    return data ? JSON.parse(data) : null;
  }

  // --- COMPUTED ---
  totalRevenue = computed(() => this.products().reduce((acc, p) => acc + p.revenue, 0));
  activeTasks = computed(() => this.tasks().filter(t => t.status === 'Em Progresso').length);
  openTickets = computed(() => this.tickets().filter(t => t.status !== 'Resolvido').length);
  pipelineValue = computed(() => this.leads()
    .filter(l => l.status !== 'Fechado' && l.status !== 'Perdido')
    .reduce((acc, l) => acc + l.value, 0)
  );

  // --- ACTIONS: TASKS ---
  moveTask(taskId: string, newStatus: TaskStatus) {
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