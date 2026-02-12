---
title: Vanilla JS
nextjs:
  metadata:
    title: Vanilla JS
    description: Usage examples for vanilla JavaScript.
---

Usage examples for vanilla JavaScript. {% .lead %}

```js
import { checkConnectivity, watchConnectivity } from 'netlytics';

// One-time check
const result = await checkConnectivity();
console.log(result.online); // true | false
console.log(result.connectionType); // "wifi" | "cellular" | ...
console.log(result.latencyMs); // number | undefined

// Live updates
const unsubscribe = watchConnectivity(
  (result) => {
    document.body.textContent = result.online ? 'Online' : 'Offline';
  },
  { observe: true }
);

// Cleanup
unsubscribe();
```
