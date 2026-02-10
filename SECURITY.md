# Security Policy

## Supported Versions

We actively support the following versions of Netlytics with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

1. **Do not** open a public GitHub issue
2. Email security details to: [security@netlytics.com] (replace with actual email)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- We will acknowledge receipt within 48 hours
- We will provide an initial assessment within 7 days
- We will keep you informed of the progress
- We will credit you in the security advisory (unless you prefer to remain anonymous)

### Disclosure Policy

- We will work with you to understand and resolve the issue
- We will not disclose the vulnerability until a fix is available
- Once fixed, we will publish a security advisory and credit you (if desired)

## Security Best Practices

When using Netlytics:

- **Keep dependencies updated**: Regularly update Netlytics to the latest version
- **Validate inputs**: Always validate probe URLs if using custom `probeUrls`
- **Handle errors**: Properly handle connectivity check failures in your application
- **Review network requests**: Be aware that Netlytics makes HTTP requests to probe URLs

## Known Security Considerations

- Netlytics makes HTTP requests to external URLs (default probe URLs or custom ones)
- Ensure probe URLs are from trusted sources if using custom `probeUrls`
- The library does not store or transmit any user data
- All network requests are made from the client-side (browser)

Thank you for helping keep Netlytics secure!
