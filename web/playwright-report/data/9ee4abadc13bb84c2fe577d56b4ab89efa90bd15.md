# Page snapshot

```yaml
- heading "Create your account" [level=2]
- paragraph:
  - text: Or
  - link "sign in to your existing account":
    - /url: /auth/login
- text: Email address
- textbox "Email address": test-1754794653008@example.com
- text: Password
- textbox "Password": Test123!
- paragraph: Must be at least 8 characters long
- text: Confirm password
- textbox "Confirm password": Different123!
- button "Create account"
- text: Or continue with
- link "Sign in with Google":
  - /url: "#"
- link "Sign in with GitHub":
  - /url: "#"
- region "Notifications alt+T"
- button "Open Tanstack query devtools":
  - img
- alert
```