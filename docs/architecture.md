# Nexus OS - Architecture Specification

## 1. Tech Stack
- **Frontend Framework:** Angular 21 (Standalone Components, Signals)
- **Styling:** Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL, Realtime Subscriptions, Auth)
- **AI Engine:** Google Gemini SDK (`@google/genai`) using `gemini-3.1-flash`
- **Orchestration:** Synkra AIOS Method (Internal Agent Workflows)

## 2. Core Modules
1. `AppComponent`: The master router and layout orchestrator. Manages authentication state and view switching.
2. `DataService`: The single source of truth. Handles all Supabase interactions, Realtime listeners, and local State (Signals).
3. `AiService`: The neural bridge. Connects to Google Gemini, injecting Context and Agent Personas (Ana, Carla, Lucas, Orion).
4. `NexusModalComponent`: The standardized UI wrapper for all data-entry forms.
5. `NexusDrawerComponent`: The standardized UI wrapper for all detail-view panels.

## 3. Data Flow
1. User interacts with a View (e.g., `KanbanView`).
2. View calls a method on `DataService` (e.g., `addTask`).
3. `DataService` executes async Supabase RPC/Insert.
4. Supabase Realtime channel triggers `initializeData()` which updates the Signals.
5. Angular Reactivity updates the View automatically.

## 4. Known Technical Debt & Risks
- **Risk:** Type mismatches between TypeScript interfaces and Supabase schema (e.g., camelCase vs snake_case).
- **Risk:** Unhandled promise rejections in API calls (Telegram, Resend, Gemini) leading to silent UI failures.
- **Mitigation:** Strict typing in `DataService` and global error handling wrappers.