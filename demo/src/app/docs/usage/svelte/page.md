---
title: Svelte
nextjs:
  metadata:
    title: Svelte
    description: Usage examples for Svelte.
---

Usage examples for Svelte. {% .lead %}

```js
<script>
  import { onMount, onDestroy } from 'svelte';
  import { checkConnectivity, watchConnectivity } from 'netlytics';

  let online = true;
  let unsubscribe = null;

  onMount(async () => {
    const result = await checkConnectivity();
    online = result.online;

    unsubscribe = watchConnectivity(
      (result) => online = result.online,
      { observe: true }
    );
  });

  onDestroy(() => {
    unsubscribe?.();
  });
</script>

<div>{online ? 'Online' : 'Offline'}</div>
```
