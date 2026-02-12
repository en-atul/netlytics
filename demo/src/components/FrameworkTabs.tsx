'use client'

import { Fragment, useEffect, useState } from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Highlight } from 'prism-react-renderer'
import clsx from 'clsx'

const frameworks = {
  react: {
    title: 'React',
    code: `import { useEffect, useState } from 'react';
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
}`,
  },
  vue: {
    title: 'Vue',
    code: `<script setup>
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
</template>`,
  },
  angular: {
    title: 'Angular',
    code: `import { Component, OnInit, OnDestroy } from '@angular/core';
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
}`,
  },
  svelte: {
    title: 'Svelte',
    code: `<script>
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

<div>{online ? 'Online' : 'Offline'}</div>`,
  },
  js: {
    title: 'JS',
    code: `import { checkConnectivity, watchConnectivity } from 'netlytics';

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
unsubscribe();`,
  },
}

export function FrameworkTabs() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const hash = window.location.hash.slice(1).toLowerCase()
    const index = Object.keys(frameworks).findIndex((key) => key === hash)
    if (index !== -1) {
      setSelectedIndex(index)
    }
  }, [])

  useEffect(() => {
    const key = Object.keys(frameworks)[selectedIndex]
    window.location.hash = key
  }, [selectedIndex])

  return (
    <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <TabList className="mb-4 flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {Object.values(frameworks).map((framework, index) => (
          <Tab
            key={framework.title}
            className={clsx(
              'px-4 py-2 text-sm font-medium transition',
              index === selectedIndex
                ? 'border-b-2 border-sky-500 text-sky-600 dark:text-sky-400'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white',
            )}
          >
            {framework.title}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {Object.values(frameworks).map((framework) => (
          <TabPanel key={framework.title}>
            <Highlight
              code={framework.code.trimEnd()}
              language="javascript"
              theme={{ plain: {}, styles: [] }}
            >
              {({ className, style, tokens, getTokenProps }) => (
                <pre className={`${className} overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm`} style={style}>
                  <code>
                    {tokens.map((line, lineIndex) => (
                      <Fragment key={lineIndex}>
                        {line
                          .filter((token) => !token.empty)
                          .map((token, tokenIndex) => (
                            <span key={tokenIndex} {...getTokenProps({ token })} />
                          ))}
                        {'\n'}
                      </Fragment>
                    ))}
                  </code>
                </pre>
              )}
            </Highlight>
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  )
}
