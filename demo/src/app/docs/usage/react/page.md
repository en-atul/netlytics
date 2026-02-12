---
title: React
nextjs:
  metadata:
    title: React
    description: Usage examples for React.
---

Usage examples for React. {% .lead %}

```js
import { useEffect, useState } from 'react';
import { checkConnectivity, watchConnectivity } from 'netlytics';

function App() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    checkConnectivity().then(result => {
      setOnline(result.online);
    });

    const unsubscribe = watchConnectivity(
      (result) => setOnline(result.online),
      { observe: true }
    );

    return unsubscribe;
  }, []);

  return <div>{online ? 'Online' : 'Offline'}</div>;
}
```
