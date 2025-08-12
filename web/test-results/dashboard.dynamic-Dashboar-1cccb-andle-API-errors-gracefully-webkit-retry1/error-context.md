# Page snapshot

```yaml
- alert
- heading "Build Error" [level=1]
- paragraph: Failed to compile
- text: Next.js (14.2.30) is outdated
- link "(learn more)":
  - /url: https://nextjs.org/docs/messages/version-staleness
- link "./src/lib/api.ts":
  - text: ./src/lib/api.ts
  - img
- text: "Error: x the name `shouldUseMocks` is defined multiple times ,-[/Users/louisciccone/Desktop/Rythm_Daw/web/src/lib/api.ts:1:1] 1 | import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 2 | import { shouldUseMocks, getMockData } from './mocks'; : ^^^^^^^|^^^^^^ : `-- previous definition of `shouldUseMocks` here 3 | import type { 4 | Plugin, 5 | Activity, 6 | User, 7 | File, 8 | Message, 9 | Conversation, 10 | FriendRequest, 11 | Friend, 12 | DashboardStats, 13 | Settings, 14 | DeviceStatus, 15 | } from './types'; 16 | 17 | // Environment check 18 | export const shouldUseMocks = () => { : ^^^^^^^|^^^^^^ : `-- `shouldUseMocks` redefined here 19 | return process.env.NEXT_PUBLIC_USE_MOCKS === 'true' || 20 | process.env.NODE_ENV === 'test' || 21 | typeof window === 'undefined'; `----"
- contentinfo:
  - paragraph: This error occurred during the build process and can only be dismissed by fixing the error.
```