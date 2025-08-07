# Page snapshot

```yaml
- region "Notifications (F8)":
    - list
- strong: 'Something went wrong:'
- text: React is not defined
- region "Notifications alt+T"
- button "Open Tanstack query devtools":
    - img
- alert
- dialog "Unhandled Runtime Error":
    - navigation:
        - button "previous" [disabled]:
            - img "previous"
        - button "next":
            - img "next"
        - text: 1 of 5 errors Next.js (14.2.30) is outdated
        - link "(learn more)":
            - /url: https://nextjs.org/docs/messages/version-staleness
    - button "Close"
    - heading "Unhandled Runtime Error" [level=1]
    - paragraph:
        - text: 'Error: Hydration failed because the initial UI does not match what was rendered on the server. See more info here:'
        - link "https://nextjs.org/docs/messages/react-hydration-error":
            - /url: https://nextjs.org/docs/messages/react-hydration-error
    - paragraph: Expected server HTML to contain a matching <div> in <div>.
    - button:
        - img
    - code: <App> <SessionProvider> <QueryClientProvider> <ReactQueryDevtools> <div> ^^^^^
    - heading "Call Stack" [level=2]
    - group:
        - img
        - img
        - text: React
```
