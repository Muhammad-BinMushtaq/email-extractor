# Security Considerations

## Known Security Issues

This document tracks security considerations for the Email Campaign Manager application.

### ⚠️ Critical - Client-Side Admin Password

**Location**: `public/js/main.js`, line 3

**Issue**: The admin password is hardcoded in client-side JavaScript:
```javascript
const ADMIN_PASSWORD = '123456';
```

**Risk**: Any user can view the admin password by:
- Opening browser developer tools
- Viewing the JavaScript source
- Accessing the admin panel with full privileges

**Recommendation**: 
- Implement proper server-side authentication
- Use secure session management (JWT tokens)
- Remove client-side password checks
- Store credentials securely on the server
- Implement rate limiting on authentication endpoints

**Status**: Documented for future fix

---

### ⚠️ Moderate - Global Event Object Usage

**Location**: `public/js/main.js`, line 23

**Issue**: The `switchTab` function uses the global `event` object without declaring it as a parameter.

**Risk**: 
- May cause issues in certain browsers or contexts
- Makes code harder to test and maintain
- Could fail if `event` is not in global scope

**Recommendation**:
```javascript
// Current (risky):
function switchTab(tab) {
    event.preventDefault(); // Uses global event
    ...
}

// Better:
function switchTab(tab, event) {
    if (event) event.preventDefault();
    ...
}
```

**Status**: Documented for future fix

---

## Security Best Practices to Implement

1. **Authentication & Authorization**
   - Implement JWT-based authentication
   - Server-side session management
   - Secure password hashing (bcrypt)
   - Role-based access control

2. **API Security**
   - Implement proper API key validation
   - Rate limiting per user/IP
   - Input validation and sanitization
   - CORS configuration for known domains

3. **Data Protection**
   - Use environment variables for secrets
   - Encrypt sensitive data in storage
   - Implement HTTPS in production
   - Secure cookie settings

4. **Email Security**
   - Never store email passwords in client
   - Use OAuth2 instead of password authentication
   - Validate email addresses server-side
   - Implement email sending rate limits

5. **Code Security**
   - Remove sensitive data from client code
   - Implement Content Security Policy
   - Use secure headers (helmet.js)
   - Regular security audits

## Priority Actions

1. **High Priority**: Remove hardcoded admin password from client-side code
2. **Medium Priority**: Fix global event object usage
3. **Medium Priority**: Implement proper authentication system
4. **Low Priority**: Add security headers and CSP

## Notes

These issues are documented but not fixed in this refactoring to maintain minimal changes to functionality. They should be addressed in a dedicated security enhancement task.
