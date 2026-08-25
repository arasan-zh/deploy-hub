"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Chip, Spinner } from "@heroui/react";

export interface DeployResultData {
  uuid: string;
  name: string;
  url: string | null;
}

const STATUS_COLOR: Record<string, "success" | "warning" | "danger" | "default"> = {
  running: "success",
  restarting: "warning",
  exited: "danger",
  degraded: "warning",
};

function statusColor(status: string) {
  const base = status.split(":")[0];
  return STATUS_COLOR[base] ?? "default";
}

export function DeployResult({ result, onReset }: { result: DeployResultData; onReset: () => void }) {
  const [status, setStatus] = useState("starting");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    async function poll() {
      attempts += 1;
      try {
        const res = await fetch(`/api/deployments/${result.uuid}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setStatus(data.deployment.status as string);
      } catch {
        // keep polling
      }
    }

    poll();
    const interval = setInterval(() => {
      if (attempts > 40) {
        clearInterval(interval);
        return;
      }
      poll();
    }, 4000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [result.uuid]);

  const isRunning = status.startsWith("running");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">{result.name}</span>
          <Chip color={statusColor(status)} size="sm">
            {isRunning ? "live" : status.replace(":unknown", "")}
          </Chip>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-foreground/50 hover:text-foreground"
          type="button"
        >
          Deploy another
        </button>
      </div>

      <div className="mt-4">
        {!isRunning && (
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <Spinner size="sm" />
            Building and starting your app — this can take a minute.
          </div>
        )}

        {result.url && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <a
              href={result.url}
              target="_blank"
              rel="noreferrer"
              className="truncate rounded-lg bg-surface-secondary px-3 py-2 text-sm font-mono text-foreground/80 hover:bg-surface-tertiary"
            >
              {result.url}
            </a>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(result.url!);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-secondary"
            >
              {copied ? "Copied" : "Copy link"}
            </button>
            {isRunning && (
              <a
                href={result.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
              >
                Visit site →
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
