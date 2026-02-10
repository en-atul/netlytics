import "./style.css";
import {
  checkConnectivity,
  measureLatency,
  type ConnectivityResult,
  type ConnectionType,
} from "netlytics";

const statusEl = document.querySelector<HTMLElement>("[data-status]");
const statusLabelEl = document.querySelector<HTMLElement>("[data-status-label]");
const connectionTypeEl = document.querySelector<HTMLElement>("[data-connection-type]");
const latencyEl = document.querySelector<HTMLElement>("[data-latency]");
const lastCheckedEl = document.querySelector<HTMLElement>("[data-last-checked]");
const checkBtn = document.querySelector<HTMLButtonElement>("[data-check-again]");
const latencyBtn = document.querySelector<HTMLButtonElement>("[data-measure-latency]");

if (
  !statusEl ||
  !statusLabelEl ||
  !connectionTypeEl ||
  !latencyEl ||
  !lastCheckedEl ||
  !checkBtn ||
  !latencyBtn
) {
  throw new Error("Missing required DOM elements");
}

function formatConnectionType(type: ConnectionType): string {
  const labels: Record<ConnectionType, string> = {
    wifi: "Wi‑Fi",
    cellular: "Mobile data",
    ethernet: "Ethernet",
    none: "None",
    unknown: "Unknown",
  };
  return labels[type] ?? type;
}

function setStatus(result: ConnectivityResult | "checking") {
  if (result === "checking") {
    statusEl.dataset.status = "checking";
    statusLabelEl.textContent = "Checking…";
    connectionTypeEl.textContent = "—";
    latencyEl.textContent = "—";
    return;
  }

  statusEl.dataset.status = result.online ? "online" : "offline";
  statusLabelEl.textContent = result.online ? "Internet connected" : "Internet not connected";
  connectionTypeEl.textContent = formatConnectionType(result.connectionType);
  latencyEl.textContent =
    result.latencyMs !== undefined ? `${result.latencyMs} ms` : "—";
}

function setLastChecked(date: Date) {
  lastCheckedEl.textContent = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

async function runCheck() {
  setStatus("checking");
  checkBtn.disabled = true;
  try {
    const result = await checkConnectivity({ timeout: 8000 });
    setStatus(result);
    setLastChecked(new Date());
  } finally {
    checkBtn.disabled = false;
  }
}

async function runLatency() {
  const el = latencyEl;
  const prev = el.textContent;
  el.textContent = "Measuring…";
  latencyBtn.disabled = true;
  try {
    const ms = await measureLatency({ sampleSize: 3, timeout: 5000 });
    el.textContent = ms !== null ? `${ms} ms` : "Failed";
    setLastChecked(new Date());
  } finally {
    latencyBtn.disabled = false;
    if (el.textContent === "Measuring…") el.textContent = prev ?? "—";
  }
}

checkBtn.addEventListener("click", runCheck);
latencyBtn.addEventListener("click", runLatency);

// Initial check
runCheck();
