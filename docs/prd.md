# Nexus OS - Product Requirements Document (PRD)
**Version:** 2.0
**Status:** In Progress (Renewal Phase)

## 1. Project Overview
Nexus OS is the internal orchestration operating system for Konig Systems. It acts as a master hub for managing leads (CRM), client relationships, active projects, engineering tasks (Kanban), and automated AI assistance via agents (Ana SDR, Carla QA, Lucas CS, Orion Master).

### Current State
The project is built as an Angular 21 application utilizing Signals for state management and Supabase for real-time backend persistence. It has a complex UI with multiple modules (Dashboard, Portfolio, Kanban, Support, Sales, Squads, Settings) but has suffered from rapid prototyping resulting in technical debt, inconsistent data mapping (e.g., `linkedProductId` vs `linkedProjectId`), and unstable integrations.

## 2. Enhancement Scope Definition
**Enhancement Type:** Stability Improvements, Technical Debt Reduction, and Architectural Standardization.
**Impact:** Major Impact. Requires aligning all existing code with the AIOS framework standard to prevent future regressions ("conserta um, quebra outro").

## 3. Goals
- **G1:** Achieve 100% stability in UI components (no blank screens, no broken buttons).
- **G2:** Standardize all data models to match the Supabase schema perfectly.
- **G3:** Implement robust error handling for all external integrations (Gemini, Telegram, Resend).
- **G4:** Ensure the AIOS Framework is fully documented and respected by all future agents.

## 4. Requirements
### Functional
- **FR1:** The system must allow creating, reading, updating, and deleting (CRUD) of Clients, Projects, Tasks, Leads, and Tickets via professional Modals.
- **FR2:** The AI Service must dynamically read the `GEMINI_API_KEY` from Supabase secrets or Vercel environment variables, never hardcoding it.
- **FR3:** Squad Chat must support multiple agents and human members seamlessly, rendering avatars correctly even if URLs fail.

### Non-Functional
- **NFR1:** The application must build without any TypeScript errors (strict mode compliance).
- **NFR2:** State management must use Angular Signals exclusively for synchronous cross-component updates.

## 5. Epic Structure
**Epic 1: The AIOS Baseline Stabilization**
Focuses on eradicating technical debt, standardizing the database service, and ensuring the UI is bulletproof.