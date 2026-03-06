# OAuth Redirect Bridge

A minimal secure redirect page used for OAuth flows when providers require **HTTPS redirect URLs** but the actual application runs on **localhost or distributed services**.

Hosted via GitHub Pages.

---

## Problem

Many OAuth providers such as eBay or Shopify only allow HTTPS redirect URLs.

Local development environments or regionally distributed services cannot always register multiple redirect URLs.

Example limitation:

- OAuth provider allows only one redirect URL
- Development requires localhost
- Multi-region services require dynamic redirect targets
- 2+ developers want to contribute simultaneously
- Many OAuth providers → one trusted HTTPS redirect endpoint truth → automatic redirection to developer's local-machines on requested port

---

## Solution

This project provides a **secure redirect bridge**.

OAuth provider → GitHub Pages redirect → developer machine / service instance.

The page:

- Validates redirect targets
- Prevents open redirect abuse
- Forwards OAuth responses to allowed local services

---

## Usage

Add the `state` parameter to specify where the redirect should go in the format:

host:port|path

This tells the redirect page which **host, port, and path** to forward the request to.

### Example

localhost:3032|/api/v1/auth/get-token  
localhost:3055|/oauth/callback

### OAuth Setup

Configure your OAuth provider to use **this page as the redirect URL**.

After authorization, the provider will redirect to this page.  
The script validates the requested destination and forwards the request to the specified service.

### Security Restrictions

- Only hosts defined in the **allowedHosts** list are permitted.
- The port must be within the valid range (1–65535).
- Additional domains can be added for production environments if needed.

---

## Security Features

This redirect page includes multiple protections:

- Allowed redirect origin validation
- Content Security Policy
- X-Frame protection
- Referrer stripping
- Runtime object freezing
- State validation

These protections prevent the page from being used as an **open redirect service**.

---

## Important Note

This page does **not store secrets**.

Sensitive validation must always occur in the receiving application.

The redirect page only acts as a controlled bridge.
