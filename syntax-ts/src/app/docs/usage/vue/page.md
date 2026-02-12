---
title: Vue
nextjs:
  metadata:
    title: Vue
    description: Usage examples for Vue.
---

Usage examples for Vue. {% .lead %}

```js
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { checkConnectivity, watchConnectivity } from 'netlytics';

const online = ref(true);
let unsubscribe = null;

onMounted(async () => {
  const result = await checkConnectivity();
  online.value = result.online;

  unsubscribe = watchConnectivity(
    (result) => online.value = result.online,
    { observe: true }
  );
});

onUnmounted(() => {
  unsubscribe?.();
});
</script>

<template>
  <div>{{ online ? 'Online' : 'Offline' }}</div>
</template>
```
