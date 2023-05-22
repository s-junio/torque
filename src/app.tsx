import { useEffect } from "preact/hooks";
import preactLogo from "./assets/preact.svg";
import viteLogo from "/vite.svg";
import "./app.css";
import { useSignal } from "@preact/signals";
import { SystemInfo, getSystemInfo } from "./backend";
import { Gauge } from "./gauge";
import { Disk } from "./disk";

const PING_INTERVAL_MS = 2 * 1000;

const UNITS = [
  "byte",
  "kilobyte",
  "megabyte",
  "gigabyte",
  "terabyte",
  "petabyte",
];
const BYTES_PER_KB = 1000;

function formatBytes(sizeBytes: number | bigint): string {
  let size = Math.abs(Number(sizeBytes));

  let u = 0;
  while (size >= BYTES_PER_KB && u < UNITS.length - 1) {
    size /= BYTES_PER_KB;
    ++u;
  }

  return new Intl.NumberFormat([], {
    style: "unit",
    unit: UNITS[u],
    unitDisplay: "short",
    maximumFractionDigits: 1,
  }).format(size);
}

export function App() {
  const count = useSignal(0);

  const systemInfo = useSignal<SystemInfo | undefined>(undefined);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getSystemInfo().then((response) => {
        systemInfo.value = response;
      });
    }, PING_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {systemInfo.value ? (
        <Gauge
          value={systemInfo.value.used_memory / systemInfo.value.total_memory}
          label="RAM"
          context={`${formatBytes(
            systemInfo.value.used_memory
          )} / ${formatBytes(systemInfo.value.total_memory)}`}
        />
      ) : null}
      {systemInfo.value ? (
        <Gauge
          value={systemInfo.value.cpu_usage / 100}
          label="CPU"
          context={`${systemInfo.value.cpu_usage.toFixed(0)}%`}
        />
      ) : null}

      {systemInfo.value
        ? systemInfo.value.disks.map((disk) => (
            <div>
              <span>{disk.name}</span> |
              <span>{formatBytes(disk.total_space)}</span> |
              <span>{formatBytes(disk.available_space)}</span>
            </div>
          ))
        : null}
        <Disk name="System"/>
    </>
  );
}
