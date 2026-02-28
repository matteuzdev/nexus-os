---
id: STORY-001
title: Sistema de Notificações Push em Tempo Real
status: PLAN
focus_agent: "@architect"
tags: [feature, realtime, auth]
---

# User Story: Sistema de Notificações Push em Tempo Real

Como usuário do aplicativo, eu quero receber notificações push em tempo real sempre que uma tarefa for atribuída a mim ou o status de um pagamento mudar, para que eu não precise atualizar a página manualmente.

## Critérios de Aceite (Acceptance Criteria)
- [ ] O cliente deve receber a notificação num popup lateral.
- [ ] A notificação deve conter: Título, Mensagem, e Tempo decorrido.
- [ ] Se o cliente clicar na notificação, a notificação é marcada como "lida" (read) e ele é redirecionado.
- [ ] A arquitetura deve suportar 10k usuários simultâneos (WebSockets).

---

## 📋 Auto-Handoff Protocol Checklist (AIOS)

### 1. Etapa de Produto (Product Manager)
- [x] O PM coletou e detalhou a história do negócio.
- [x] O documento da Story foi gerado no diretório (`docs/stories/STORY-001-realtime-notifications.md`).

### 2. Etapa de Arquitetura (Architect) -> **🟢 PRÓXIMA FASE**
- [ ] Definir a infraestrutura (WebSocket vs SSE vs Polling).
- [ ] Sugerir tecnologias baseadas no ecossistema (ex: Supabase Realtime).
- [ ] Desenhar entidades no banco (`notifications` table).
- [ ] Adicionar notas técnicas no final deste arquivo e assinar Handoff para o Desenvolvedor (@dev).

### 3. Etapa de Desenvolvimento Backend/DB (@data-engineer / @dev)
- [ ] Implementar Schema de BD (+ RLS policies).
- [ ] Criar trigger/hook no Supabase ou Edge Functions para disparar a notificação.

### 4. Etapa Frontend e Integração UI (@ux-design-expert / @dev)
- [ ] UX gera os tokens de design do toast (Popup).
- [ ] Dev cria ou consome componente do Angular + WebSocket Client.

### 5. Etapa Qualidade (@qa)
- [ ] Escrever casos de teste (carga simulada e UI E2E) e aprovar a Feature.
