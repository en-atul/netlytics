'use client'

import { useEffect, useState } from 'react'
import {
  checkConnectivity,
  measureLatency,
  watchConnectivity,
  type ConnectivityResult,
  type ConnectionType,
  type NetworkQuality,
} from 'netlytics'

function formatConnectionType(type: ConnectionType): string {
  const labels: Record<ConnectionType, string> = {
    wifi: 'Wi-Fi',
    cellular: 'Mobile data',
    ethernet: 'Ethernet',
    none: 'None',
    unknown: 'Unknown',
  }
  return labels[type] ?? type
}

function formatNetworkQuality(quality: NetworkQuality): string {
  const labels: Record<NetworkQuality, string> = {
    'slow-2g': 'Slow 2G',
    '2g': '2G',
    '3g': '3G',
    '4g': '4G',
    unknown: 'Unknown',
  }
  return labels[quality] ?? quality
}

export function Demo() {
  const [status, setStatus] = useState<'checking' | ConnectivityResult>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [liveUpdates, setLiveUpdates] = useState(true)
  const [isChecking, setIsChecking] = useState(false)
  const [isMeasuringLatency, setIsMeasuringLatency] = useState(false)

  useEffect(() => {
    let unwatch: (() => void) | null = null

    async function runCheck() {
      setIsChecking(true)
      try {
        const result = await checkConnectivity({ timeout: 8000 })
        setStatus(result)
        setLastChecked(new Date())
      } finally {
        setIsChecking(false)
      }
    }

    function startWatching() {
      unwatch?.()
      unwatch = watchConnectivity(
        (result) => {
          setStatus(result)
          setLastChecked(new Date())
        },
        {
          observe: true,
          timeout: 8000,
          offlineProbeTimeoutMs: 2000,
          onChecking: () => setStatus('checking'),
        },
      )
    }

    function stopWatching() {
      unwatch?.()
      unwatch = null
    }

    // Initial check
    runCheck()

    // Start live updates if enabled
    if (liveUpdates) {
      startWatching()
    }

    return () => {
      stopWatching()
    }
  }, [liveUpdates])

  async function handleCheckAgain() {
    setIsChecking(true)
    setStatus('checking')
    try {
      const result = await checkConnectivity({ timeout: 8000 })
      setStatus(result)
      setLastChecked(new Date())
    } finally {
      setIsChecking(false)
    }
  }

  async function handleMeasureLatency() {
    setIsMeasuringLatency(true)
    // Clear latency value to show "Measuring…"
    if (status !== 'checking' && typeof status === 'object') {
      setStatus({ ...status, latencyMs: undefined })
    }
    try {
      const ms = await measureLatency({ sampleSize: 3, timeout: 5000 })
      if (status !== 'checking' && typeof status === 'object') {
        setStatus({ ...status, latencyMs: ms ?? undefined })
      }
      setLastChecked(new Date())
    } finally {
      setIsMeasuringLatency(false)
    }
  }

  const statusLabel =
    status === 'checking'
      ? 'Checking…'
      : status.online
        ? 'Internet connected'
        : 'Internet not connected'

  const statusColor =
    status === 'checking'
      ? 'bg-yellow-500'
      : status.online
        ? 'bg-green-500'
        : 'bg-red-500'

  return (
    <div className="my-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10">
      <div className="mb-4 flex items-center gap-3">
        <span
          className={`h-3 w-3 rounded-full ${statusColor} ${
            status === 'checking' ? 'animate-pulse' : ''
          }`}
          aria-hidden="true"
        />
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {statusLabel}
        </span>
      </div>

      <dl className="mb-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-slate-600 dark:text-slate-400">Connection type</dt>
          <dd className="font-medium text-slate-900 dark:text-slate-100">
            {status === 'checking'
              ? '—'
              : formatConnectionType(status.connectionType)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-600 dark:text-slate-400">Network quality</dt>
          <dd className="font-medium text-slate-900 dark:text-slate-100">
            {status === 'checking'
              ? '—'
              : formatNetworkQuality(status.networkQuality)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-600 dark:text-slate-400">Latency</dt>
          <dd className="font-medium text-slate-900 dark:text-slate-100">
            {isMeasuringLatency
              ? 'Measuring…'
              : status === 'checking' || typeof status === 'object'
                ? status !== 'checking' && status.latencyMs !== undefined
                  ? `${status.latencyMs} ms`
                  : '—'
                : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-slate-600 dark:text-slate-400">Last checked</dt>
          <dd className="font-medium text-slate-900 dark:text-slate-100">
            {lastChecked
              ? lastChecked.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              : '—'}
          </dd>
        </div>
      </dl>

      <label className="mb-4 flex cursor-pointer items-center gap-3 text-sm text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">
        <input
          type="checkbox"
          checked={liveUpdates}
          onChange={(e) => setLiveUpdates(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-lg border-2 transition-all ${
            liveUpdates
              ? 'border-sky-500 bg-sky-500 dark:border-sky-500 dark:bg-sky-500'
              : 'border-slate-300 bg-white hover:border-sky-400 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-sky-500'
          }`}
        >
          {liveUpdates && (
            <svg
              className="h-3.5 w-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <span className="select-none font-medium">Live updates</span>
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCheckAgain}
          disabled={isChecking}
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600 disabled:opacity-50 dark:bg-sky-500 dark:hover:bg-sky-400"
        >
          {isChecking ? 'Checking…' : 'Check again'}
        </button>
        <button
          type="button"
          onClick={handleMeasureLatency}
          disabled={isMeasuringLatency}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
        >
          {isMeasuringLatency ? 'Measuring…' : 'Measure latency'}
        </button>
      </div>
    </div>
  )
}
