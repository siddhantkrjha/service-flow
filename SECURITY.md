# Security Policy

## Supported Versions

Only the latest release on the primary development branch is actively supported with security updates.

| Version / Branch | Supported          |
| ---------------- | ------------------ |
| `main`           | :white_check_mark: |
| 1.0.x            | :white_check_mark: |
| < 1.0.0          | :x:                |

## Reporting a Vulnerability

We take the security of Service Flow seriously. If you discover a potential security vulnerability, please practice responsible disclosure.

**Please do NOT disclose potential vulnerabilities publicly through GitHub Issues, Discussions, or pull requests.**

### How to Report

1. **GitHub Private Vulnerability Reporting**:
   If enabled on this repository, please report the issue through the **Security** tab by selecting **"Report a vulnerability"** (Security Advisories).
2. **Contacting the Maintainer**:
   If private vulnerability reporting is unavailable, please reach out to the project maintainer via their GitHub profile ([@siddhantkrjha](https://github.com/siddhantkrjha)) to request an appropriate secure communication channel before sharing technical vulnerability details or proof-of-concept exploits.

### What to Include in Your Report

To help us triage and resolve the issue quickly, please provide:
- A clear description of the potential vulnerability.
- Step-by-step instructions or minimal proof-of-concept to reproduce the behavior safely.
- The affected component, file, or endpoint.
- An assessment of the potential impact.

We will review your submission promptly and follow up with updates on remediation progress.

## Handling Credentials and Secret Exposure

- If credentials, API keys, database connection strings, or service tokens are accidentally exposed or suspected of compromise, they must be **immediately revoked and rotated** at the provider source.
- Frontend code should never bundle or utilize elevated credentials (e.g., Supabase `service_role` keys). Only public anonymous keys (`VITE_SUPABASE_ANON_KEY`) subject to PostgreSQL Row Level Security (RLS) policies should ever be accessible in client-side code.
