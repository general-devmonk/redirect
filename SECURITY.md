# Security Policy

This project implements protections against open redirect abuse.

## Design Principles

This page cannot prevent third parties from referencing the public URL in their OAuth applications.
However the redirect logic prevents malicious redirection behavior.

- No secrets stored in client
- Strict redirect origin validation
- CSP restrictions
- Minimal attack surface

## Reporting a Vulnerability

  If you discover a security issue, please report it privately, Our security team reviews
submissions and provides an update within a few business days.

  If the vulnerability is accepted, we will acknowledge the report, begin remediation,
and may credit the reporter where applicable. If the report is declined, we will provide
a brief explanation where possible. We appreciate responsible disclosure to help keep our systems secure
