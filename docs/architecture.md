# Nexus OS - System Architecture

## Design Philosophy
- **Anti-ADHD UI**: Interfaces focadas, de alta densidade mas sem distrações visuais desnecessárias.
- **AI-Native Integration**: IA não é opcional, é o motor de triagem e execução.
- **Realtime Sync**: Todo o estado é espelhado via Supabase Realtime.

## Data Flow
- **State Management**: Angular Signals como fonte da verdade local no frontend.
- **Persistence**: Supabase Postgres para persistência duradoura.
- **Intelligence**: AI Service como orquestrador de mentes (Ana, Carla, Lucas, Orion).

## Database Schema (Snake_case Standard)
- `products`: id, name, stage, version, revenue, next_action.
- `tasks`: id, title, description, status, tag, linked_product_id, origin_ticket_id.
- `tickets`: id, client, title, description, status, linked_product_id, reproduction_steps, sla_hours.
- `messages`: id, sender_id, sender_name, content, is_private, timestamp.
- `personal_tasks`: id, title, status, is_completed, type, created_at.
