# Security Audit (Firebase Rules & Auth)

Run a security audit on Firebase rules, auth flows, and sensitive data.

**Instructions:**
1. Identify security-sensitive code paths (auth, rules, admin routes)
2. Check firestore.rules and storage.rules for proper access control
3. Verify admin-only writes (request.auth != null, isAdmin checks)
4. Ensure no secrets or API keys are hardcoded
5. Review input validation and sanitization
6. Check auth guard implementation for /admin routes

**Report findings by severity:**
- **Critical (must fix before deploy):** Unauthorized access possible, exposed secrets
- **High (fix soon):** Weak rules, missing validation
- **Medium (address when possible):** Best practice improvements

Include specific file paths, rule snippets, and recommended fixes.
