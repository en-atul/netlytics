---
title: Angular
nextjs:
  metadata:
    title: Angular
    description: Usage examples for Angular.
---

Usage examples for Angular. {% .lead %}

```js
import { Component, OnInit, OnDestroy } from '@angular/core';
import { checkConnectivity, watchConnectivity } from 'netlytics';

@Component({
  selector: 'app-root',
  template: '<div>{{ online ? "Online" : "Offline" }}</div>'
})
export class AppComponent implements OnInit, OnDestroy {
  online = true;
  private unsubscribe?: () => void;

  async ngOnInit() {
    const result = await checkConnectivity();
    this.online = result.online;

    this.unsubscribe = watchConnectivity(
      (result) => this.online = result.online,
      { observe: true }
    );
  }

  ngOnDestroy() {
    this.unsubscribe?.();
  }
}
```
