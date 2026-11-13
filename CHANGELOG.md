# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Supabase live database synchronization and live multi-tenant authentication.
- Automated customer notifications and status alerts (SMS / email).
- Advanced dispatch routing and field mapping.
- Online payment gateway integration (e.g., Stripe) for invoice settlement.

## [1.0.0] - 2026-11-13

### Added
- **Core SaaS Application Shell**:
  - Responsive layout with collapsible navy sidebar (`bg-slate-900`) and active route badges.
  - Top navigation bar with breadcrumbs, quick global search dialog (`Cmd+K` / `Ctrl+K`), notifications drawer, and user profile view.
  - Persistent Demo Mode status bar with single-click demo data reset.
- **Operations Dashboard**:
  - Live aggregated KPIs: Total Revenue, Active Jobs, Upcoming Bookings, and Outstanding Invoices.
  - Interactive Recharts monthly revenue area chart and jobs-by-status donut chart.
  - Recent bookings activity queue, upcoming job schedule list, and unpaid invoices card.
- **Customer Directory**:
  - Customer profile management with unique account identifiers (`CUST-xxxx`).
  - Search by name, phone, email, and property address with active/inactive filtering.
  - Detailed customer modal showing service history, linked bookings, and billing history.
- **Bookings & Smart Scheduling**:
  - Dual-mode scheduling: interactive tabular list and monthly calendar grid.
  - Booking creation modal with automatic customer address autofill and service category rate lookup.
  - One-click workflow to convert confirmed bookings into dispatched work orders.
- **Work Orders & Field Dispatch**:
  - Work order dispatch tracking linked to customer accounts and assigned field technicians.
  - Priority status levels (`Low`, `Medium`, `High`, `Urgent`) and lifecycle tracking (`Pending`, `Assigned`, `In Progress`, `Completed`, `Cancelled`).
  - Comprehensive chronological activity audit log tracking dispatch timestamps and author actions.
  - Direct conversion from completed work orders into new invoices.
- **Technician Management**:
  - Technician roster with skill tagging and real-time availability badges (`Available`, `Busy`, `Unavailable`).
  - Dynamic workload tracking with active and completed job counters.
- **Invoices & Billing**:
  - Multi-line item invoice creation with automated subtotal, tax calculation, and total amounts.
  - Invoice status management (`Draft`, `Sent`, `Paid`, `Overdue`, `Cancelled`).
  - Dedicated browser-printable invoice view styled for standard commercial paper printing (`window.print()`).
- **Reports & Analytics**:
  - Historical monthly revenue trajectories.
  - Job completion breakdown, service category distribution, and technician performance metrics.
- **Business Settings & Customization**:
  - Business profile configuration (company name, address, email, phone, currency, timezone, tax rate).
  - Service categories manager with customizable hourly rates and color tags.
- **Demo Mode & Persistence**:
  - Pre-seeded with realistic service industry demo data (Apex Field Services Co.).
  - Complete browser LocalStorage persistence for all CRUD operations without requiring external backend credentials.
  - One-click demo data reset.
- **Supabase-Ready Database Architecture**:
  - Complete PostgreSQL schema migration script (`src/lib/supabase/schema.sql`) featuring UUID primary keys, foreign key constraints, performance indexes, and Row Level Security (RLS) tenant isolation policies.
  - Client initialization module (`src/lib/supabase/client.ts`) with graceful fallback to browser demo storage when credentials are not configured.
