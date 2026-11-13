# Service Flow

> **Manage every job. Serve every customer. Run your business smoothly.**

Service Flow is an open-source service business management platform designed for small and medium-sized field-service businesses — including HVAC contractors, plumbing services, electrical contractors, property maintenance crews, landscaping services, and repair specialists.

The application unifies the core operational workflow of field service teams: receiving client requests, scheduling bookings, dispatching technicians via work orders, tracking job statuses, and generating professional customer invoices.

---

## Key Features

The repository provides a complete, working frontend application with the following implemented modules:

- **Operations Dashboard**: Real-time KPI summary cards (Total Revenue, Active Jobs, Upcoming Bookings, Outstanding Invoices), monthly revenue charts, job distribution breakdowns, and quick dispatch queues.
- **Customer Management**: Central customer directory with persistent unique customer numbers (`CUST-xxxx`), contact information, physical service addresses, and linked booking/invoice histories.
- **Booking Management**: Interactive booking list with multi-field filtering (status, customer, date) and customer rate lookup.
- **Calendar Scheduling**: Visual monthly scheduling calendar displaying scheduled service appointments with direct event modals.
- **Work Order Management & Dispatch**: Operational work order tracking with priority badges (`Low`, `Medium`, `High`, `Urgent`), status lifecycles (`Pending`, `Assigned`, `In Progress`, `Completed`, `Cancelled`), and chronological activity audit logs.
- **Technician Assignment**: Technician roster management with skill tags, real-time availability statuses (`Available`, `Busy`, `Unavailable`), and active workload metrics.
- **Invoice Creation & Billing**: Multi-item invoice builder with customizable tax rates, automated balance calculation, lifecycle tracking (`Draft`, `Sent`, `Paid`, `Overdue`, `Cancelled`), and browser-native printable invoice layout (`window.print()`).
- **Revenue & Operational Analytics**: Visual analytics showing gross revenue over time, job completion trends, service category demand, and technician job efficiency.
- **Business Settings**: Centralized business profile management (company name, contact details, currency, timezone, tax rate) and configurable service categories with hourly rates.
- **Demo Mode**: Instant out-of-the-box evaluation without requiring backend setup or cloud credentials.
- **LocalStorage Persistence**: Full CRUD state persistence across page reloads in browser `localStorage`, with single-click demo reset functionality.
- **Supabase-Ready Architecture**: Prepared PostgreSQL database schema migration (`src/lib/supabase/schema.sql`) with Row Level Security (RLS) policies and modular Supabase client connection (`src/lib/supabase/client.ts`).

---

## Screenshots

<!-- Screenshot placeholders: capture and add UI screenshots here -->
```
+------------------------------------------------------------------------------------+
| [DEMO MODE ACTIVE]  Simulated live environment. Changes persist in your browser.   |
+------------------------------------------------------------------------------------+
| Service Flow |  Overview > Operations Center                      [Search] [Bell]  |
|              |                                                                     |
| [x] Overview |  [Total Revenue]   [Active Jobs]   [Upcoming Bookings]  [Pending]   |
| [ ] Bookings |     $2,145.05            2                  2            $3,989.02  |
| [ ] Orders   |                                                                     |
| [ ] Clients  |  +---------------------------------+  +--------------------------+  |
| [ ] Techs    |  | Revenue & Job Performance Chart |  | Jobs by Status (Donut)   |  |
| [ ] Invoices |  +---------------------------------+  +--------------------------+  |
| [ ] Reports  |                                                                     |
| [ ] Settings |  +---------------------------------+  +--------------------------+  |
|              |  | Recent Service Bookings Table   |  | Field Dispatch Queue     |  |
+--------------+--+---------------------------------+--+--------------------------+--+
```

*Visual walkthrough screenshots will be added to this section in upcoming documentation updates.*

---

## Technology Stack

- **Frontend Framework**: [React 18](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Application Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) & [PostCSS](https://postcss.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Data Visualization**: [Recharts 2](https://recharts.org/)
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) & [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
- **Date Management**: [date-fns](https://date-fns.org/)
- **Backend-Ready Client**: [@supabase/supabase-js](https://supabase.com/)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- `npm` (version 9.0.0 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/siddhantkrjha/service-flow.git
   cd service-flow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the local development server with Hot Module Replacement (HMR) |
| `npm run build` | Compiles TypeScript (`tsc -b`) and bundles production assets via Vite |
| `npm run lint` | Runs the TypeScript compiler check (`tsc -b`) |
| `npm run preview` | Serves the production build locally for verification |

---

## Demo Mode

Service Flow is equipped with an integrated Demo Mode out of the box:

- **No Credentials Required**: You can immediately launch, test, and explore every screen without setting up a database or cloud account.
- **Browser LocalStorage Persistence**: All create, read, update, and delete actions (customers, bookings, work orders, technicians, and invoices) persist across page reloads in your browser's local storage.
- **Pre-loaded Sample Data**: The application includes realistic seed records representing "Apex Field Services Co." with active jobs, schedules, and invoices.
- **Instant Data Reset**: Click the **Reset Demo Data** button in the top banner or navigate to **Settings** to restore all records to their initial state.
- **Important Note**: Demo Mode operates strictly inside your local browser. It is intended for evaluation and standalone testing, and is not a multi-user production database.

---

## Supabase Configuration (Prepared Architecture)

Service Flow includes a complete, prepared architecture for integrating with a [Supabase](https://supabase.com) backend.

> **Note on Architecture**: The project includes the database schema and client connection layer. It operates in local demo mode by default and gracefully activates Supabase when valid project credentials are provided.

### Connecting Your Supabase Project

1. **Create a Supabase Project**:
   Sign in to your [Supabase Dashboard](https://app.supabase.com) and create a new project.

2. **Execute Database Schema**:
   In your Supabase project dashboard, navigate to the **SQL Editor**, open the schema file located in this repository at:
   ```
   src/lib/supabase/schema.sql
   ```
   Execute the script to create tables (`businesses`, `customers`, `service_categories`, `technicians`, `bookings`, `work_orders`, `invoices`, `notifications`), indexes, and PostgreSQL Row Level Security (RLS) policies.

3. **Set Up Environment Variables**:
   Copy `.env.example` to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-public-anon-key
   ```

4. **Restart the Development Server**:
   ```bash
   npm run dev
   ```
   The application client (`src/lib/supabase/client.ts`) will detect the configuration automatically.

---

## Project Structure

```text
service-flow/
├── .github/                         # GitHub issue templates, PR template & funding
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── FUNDING.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── public/                          # Static assets and brand mark
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── bookings/                # Booking list, calendar grid, details & modals
│   │   ├── customers/               # Customer roster, filterable table, modals
│   │   ├── dashboard/               # Stat cards, revenue charts, status breakdown
│   │   ├── invoices/                # Invoices table, creator modal, printable view
│   │   ├── layout/                  # Sidebar, TopNav, DemoBanner, AppLayout
│   │   ├── reports/                 # Revenue, job trends, technician metrics
│   │   ├── settings/                # Business profile form, service categories
│   │   ├── technicians/             # Technician roster, skills, modal
│   │   ├── ui/                      # Button, Card, Badge, Modal, Input, Textarea, Toast
│   │   └── work-orders/             # Dispatch queue, priority tags, activity log
│   ├── contexts/
│   │   └── DataContext.tsx          # Central application state, calculations, and toast
│   ├── data/
│   │   └── initialData.ts           # Realistic demo dataset (Apex Field Services Co.)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Supabase client with demo fallback logic
│   │   │   └── schema.sql           # Complete PostgreSQL schema with RLS policies
│   │   └── utils.ts                 # Formatting helpers and Tailwind class mergers
│   ├── pages/                       # High-level route views
│   ├── services/
│   │   └── storage.ts               # LocalStorage CRUD operations service
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions and interfaces
│   ├── App.tsx                      # Route tree configuration
│   ├── index.css                    # Global Tailwind directives & print styles
│   └── main.tsx                     # Application entry point
├── .env.example                     # Environment configuration template
├── CHANGELOG.md                     # Project release history
├── CODE_OF_CONDUCT.md               # Contributor Covenant Code of Conduct
├── CONTRIBUTING.md                  # Development and contribution guide
├── LICENSE                          # MIT License
├── package.json                     # Project manifest and dependencies
├── README.md                        # Project documentation
├── SECURITY.md                      # Security vulnerability policy
├── THIRD_PARTY_NOTICES.md           # Third-party licenses and asset attribution
├── tsconfig.json                    # TypeScript compiler configuration
└── vite.config.ts                   # Vite bundler configuration
```

---

## Roadmap

The following enhancements and extensions are planned for future releases:

- **Production Supabase Authentication**: User registration, login, session management, and multi-tenant organization switching.
- **Live Database Synchronization**: Dual-write/live sync replacing LocalStorage when connected to Supabase.
- **Customer Feedback & Review Collection**: Post-service customer feedback ratings and review logging module.
- **Automated Dispatch Notifications**: Automated SMS and email notifications for customer booking confirmation and technician dispatch.
- **Advanced Scheduling & Route Optimization**: Multi-stop routing, GPS location integration, and technician driving radius visualization.
- **Extended Financial Reporting**: Cash-flow projection, tax liability summaries, and export to CSV/PDF.
- **Payment Provider Integrations**: Direct online card processing (e.g. Stripe, Square) for instant invoice payment.

---

## Contributing

Contributions, bug reports, and suggestions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for local development guidelines, commit standards, and the pull request workflow.

---

## Security

For vulnerability disclosures and security policies, please review [SECURITY.md](SECURITY.md). Never submit sensitive vulnerability reports or private credentials through public GitHub issues.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Support the Project

If you find Service Flow useful for your business, starter project, or client engagements, please consider supporting ongoing open-source development:

- **GitHub Sponsors**: [https://github.com/sponsors/siddhantkrjha](https://github.com/sponsors/siddhantkrjha)

Sponsorship is entirely voluntary and directly funds maintenance, documentation improvements, new features, and future open-source tools.

---

## Professional Services

Service Flow is free and open-source software under the MIT License. For organizations that require dedicated technical assistance, optional commercial services are available, including:

- **Custom Installation & Cloud Deployment**: Assistance deploying Service Flow to your own hosting infrastructure (Vercel, Netlify, AWS, etc.) and provisioning Supabase databases.
- **Business-Specific Customization**: Adapting data models, workflows, and dispatch logic to match your specific field-service requirements.
- **Custom Branding & UI Modifications**: Tailoring visual themes, corporate identity, custom typography, and print invoices.
- **Third-Party Integrations**: Connecting Service Flow to external CRM systems, accounting platforms (QuickBooks, Xero), or payment processors (Stripe).
- **Custom Feature Development**: Building dedicated modules such as custom client portals or specialized field technician workflows.

To inquire about commercial services, contact the maintainer through their GitHub profile ([@siddhantkrjha](https://github.com/siddhantkrjha)).

*Note: Professional services are completely independent of the free, MIT-licensed open-source codebase.*
