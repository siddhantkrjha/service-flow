# Contributing to Service Flow

Thank you for your interest in contributing to Service Flow! Service Flow is an open-source service business management platform designed for small and medium-sized field-service companies (HVAC contractors, plumbers, electricians, property maintenance teams, and cleaning services).

We welcome contributions from developers, designers, and domain experts.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Branch Naming Recommendations](#branch-naming-recommendations)
- [Commit Message Conventions](#commit-message-conventions)
- [Bug Reporting](#bug-reporting)
- [Feature Request Process](#feature-request-process)
- [Code Quality & Style Guidelines](#code-quality--style-guidelines)
- [Testing Instructions](#testing-instructions)
- [Pull Request Process](#pull-request-process)
- [Security & Environment Safety](#security--environment-safety)

---

## Code of Conduct

All contributors and participants are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat all members of the community with dignity, respect, and constructive collaboration.

---

## Prerequisites

Before contributing, ensure you have the following installed locally:

- **Node.js**: v18.0.0 or later (v20+ LTS recommended)
- **npm**: v9.0.0 or later (shipped with Node.js)
- **Git**: v2.30.0 or later

---

## Local Setup

1. **Fork the repository** on GitHub: [https://github.com/siddhantkrjha/service-flow](https://github.com/siddhantkrjha/service-flow)
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/service-flow.git
   cd service-flow
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the local development server**:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:5173`. The application runs out-of-the-box in **Demo Mode** with persistent LocalStorage.

---

## Branch Naming Recommendations

Use descriptive, prefixed branch names:

- `feature/<short-description>`: New functionality or enhancements (e.g. `feature/calendar-week-view`)
- `fix/<short-description>`: Bug fixes (e.g. `fix/invoice-tax-rounding`)
- `docs/<short-description>`: Documentation improvements (e.g. `docs/update-readme-setup`)
- `refactor/<short-description>`: Code reorganization without feature alterations
- `chore/<short-description>`: Maintenance, dependency updates, or configuration

---

## Commit Message Conventions

We follow clean, conventional commit messages:

- `feat: <description>`: Adds new features
- `fix: <description>`: Corrects a bug
- `docs: <description>`: Changes to documentation
- `refactor: <description>`: Code restructuring without feature changes
- `chore: <description>`: Maintenance tasks and build updates

Example:
```text
feat(bookings): add date-range filtering to booking calendar
fix(invoices): correct balance calculation when partial payment is applied
```

---

## Bug Reporting

If you find a bug, please check existing GitHub issues before filing a new one. When opening a report:

1. Use the **Bug Report Template** (`.github/ISSUE_TEMPLATE/bug_report.md`).
2. Provide clear, minimal reproduction steps.
3. Describe the expected behavior versus the actual behavior observed.
4. Include your operating system, browser, and version.

---

## Feature Request Process

Have an idea for a feature or workflow enhancement?

1. Open a discussion or create an issue using the **Feature Request Template** (`.github/ISSUE_TEMPLATE/feature_request.md`).
2. Describe the business problem or user friction you want to solve.
3. Outline your proposed solution and expected benefits.
4. Await feedback from maintainers before writing extensive code for major architectural changes.

---

## Code Quality & Style Guidelines

- **TypeScript**: Strict typing is enabled. Avoid using `any` — use explicit interfaces or types defined in `src/types/index.ts`.
- **Component Design**: Keep UI components modular, clean, and decoupled from state containers where possible.
- **Styling**: Use Tailwind CSS utility classes adhering to the project's slate/sky design theme.
- **State & Persistence**: Changes made in demo mode should integrate cleanly with `src/services/storage.ts` and `src/contexts/DataContext.tsx`.

---

## Testing Instructions

Before committing or submitting a pull request, run all available verification commands:

```bash
# Type check the codebase
npm run lint

# Verify the production build compiles cleanly
npm run build
```

Verify that both commands exit with code `0`.

---

## Pull Request Process

1. Keep PRs focused on a single concern or feature.
2. Complete the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
3. Ensure all lint and build commands pass.
4. Provide screenshots or video recordings for any user-interface modifications.
5. Maintainers will review your PR and provide feedback or approval.

---

## Security & Environment Safety

- **Never commit secrets**: Do not commit `.env`, `.env.local`, API keys, tokens, or Supabase service-role credentials.
- **Never commit build artifacts**: Do not commit `node_modules/`, `dist/`, or temporary logs.
- For vulnerability reports, follow the guidelines in [SECURITY.md](SECURITY.md).
