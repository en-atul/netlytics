import "./style.css";
import {
  checkConnectivity,
  measureLatency,
  watchConnectivity,
  type ConnectivityResult,
  type ConnectionType,
  type NetworkQuality,
} from "netlytics";

const statusEl = document.querySelector<HTMLElement>("[data-status]");
const statusLabelEl = document.querySelector<HTMLElement>("[data-status-label]");
const connectionTypeEl = document.querySelector<HTMLElement>("[data-connection-type]");
const networkQualityEl = document.querySelector<HTMLElement>("[data-network-quality]");
const latencyEl = document.querySelector<HTMLElement>("[data-latency]");
const lastCheckedEl = document.querySelector<HTMLElement>("[data-last-checked]");
const checkBtn = document.querySelector<HTMLButtonElement>("[data-check-again]");
const latencyBtn = document.querySelector<HTMLButtonElement>("[data-measure-latency]");
const liveUpdatesToggle = document.querySelector<HTMLInputElement>("[data-live-updates]");

if (
  !statusEl ||
  !statusLabelEl ||
  !connectionTypeEl ||
  !networkQualityEl ||
  !latencyEl ||
  !lastCheckedEl ||
  !checkBtn ||
  !latencyBtn ||
  !liveUpdatesToggle
) {
  throw new Error("Missing required DOM elements");
}

// At this point all queried elements are guaranteed to exist.
const status = statusEl!;
const statusLabel = statusLabelEl!;
const connectionTypeNode = connectionTypeEl!;
const networkQualityNode = networkQualityEl!;
const latencyNode = latencyEl!;
const lastCheckedNode = lastCheckedEl!;
const checkButton = checkBtn!;
const latencyButton = latencyBtn!;
const liveUpdatesCheckbox = liveUpdatesToggle!;

let unwatch: (() => void) | null = null;

function formatConnectionType(type: ConnectionType): string {
  const labels: Record<ConnectionType, string> = {
    wifi: "Wi-Fi",
    cellular: "Mobile data",
    ethernet: "Ethernet",
    none: "None",
    unknown: "Unknown",
  };
  return labels[type] ?? type;
}

function formatNetworkQuality(quality: NetworkQuality): string {
  const labels: Record<NetworkQuality, string> = {
    "slow-2g": "Slow 2G",
    "2g": "2G",
    "3g": "3G",
    "4g": "4G",
    unknown: "Unknown",
  };
  return labels[quality] ?? quality;
}

function setStatus(result: ConnectivityResult | "checking") {
  if (result === "checking") {
    status.dataset.status = "checking";
    statusLabel.textContent = "Checking…";
    connectionTypeNode.textContent = "—";
    networkQualityNode.textContent = "—";
    latencyNode.textContent = "—";
    return;
  }

  status.dataset.status = result.online ? "online" : "offline";
  statusLabel.textContent = result.online ? "Internet connected" : "Internet not connected";
  connectionTypeNode.textContent = formatConnectionType(result.connectionType);
  networkQualityNode.textContent = formatNetworkQuality(result.networkQuality);
  latencyNode.textContent =
    result.latencyMs !== undefined ? `${result.latencyMs} ms` : "—";
}

function setLastChecked(date: Date) {
  lastCheckedNode.textContent = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

async function runCheck() {
  setStatus("checking");
  checkButton.disabled = true;
  try {
    const result = await checkConnectivity({ timeout: 8000 });
    setStatus(result);
    setLastChecked(new Date());
  } finally {
    checkButton.disabled = false;
  }
}

async function runLatency() {
  const el = latencyNode;
  const prev = el.textContent;
  el.textContent = "Measuring…";
  latencyButton.disabled = true;
  try {
    const ms = await measureLatency({ sampleSize: 3, timeout: 5000 });
    el.textContent = ms !== null ? `${ms} ms` : "Failed";
    setLastChecked(new Date());
  } finally {
    latencyButton.disabled = false;
    if (el.textContent === "Measuring…") el.textContent = prev ?? "—";
  }
}

function startWatching() {
  unwatch?.();
  unwatch = watchConnectivity(
    (result) => {
      setStatus(result);
      setLastChecked(new Date());
    },
    {
      observe: true,
      timeout: 8000,
      offlineProbeTimeoutMs: 2000,
      onChecking: () => setStatus("checking"),
    }
  );
}

function stopWatching() {
  unwatch?.();
  unwatch = null;
}

liveUpdatesToggle.addEventListener("change", () => {
  if (liveUpdatesCheckbox.checked) {
    startWatching();
  } else {
    stopWatching();
  }
});

checkButton.addEventListener("click", runCheck);
latencyButton.addEventListener("click", runLatency);

// Initial check
runCheck();

// Start live updates (validates online/offline events with a probe)
if (liveUpdatesCheckbox.checked) {
  startWatching();
}
