"use client";

import { useEffect, useState } from "react";
import { Chip, EmptyState, Spinner } from "@heroui/react";
import type { Deployment } from "@/lib/coolify";

const STATUS_COLOR: Record<string, "success" | "warning" | "danger" | "default"> = {
  running: "success",
  restarting: "warning",
  exited: "danger",
  degraded: "warning",
};

function statusColor(status: string) {
  return STATUS_COLOR[status.split(":")[0]] ?? "default";
}

export function DeploymentsList() {
  const [deployments, setDeployments] = useState<Deployment[] | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/deployments", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setDeployments(data.deployments);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  async function handleDelete(uuid: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    setDeleting(uuid);
    await fetch(`/api/deployments/${uuid}`, { method: "DELETE" });
    await load();
    setDeleting(null);
  }

  if (deployments === null) {
    return (
      <div className="flex items-center justify-center py-16 text-black/50">
        <Spinner size="sm" />
        <span className="ml-2">Loading deployments…</span>
      </div>
    );
  }

  if (deployments.length === 0) {
    return (
      <EmptyState className="py-16 text-center text-black/50">
        Nothing deployed yet — go deploy something.
      </EmptyState>
    );
  }

  return (
    <ul className="space-y-3">
      {deployments.map((d) => (
        <li
          key={d.uuid}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/[.08] bg-white p-4"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">{d.name}</span>
              <Chip color={statusColor(d.status)} size="sm">
                {d.status.replace(":unknown", "")}
              </Chip>
              <span className="rounded-full bg-black/[.05] px-2 py-0.5 text-xs text-black/50">
                {d.source === "static-html" ? "HTML" : d.buildPack}
              </span>
            </div>
            {d.url && (
              <a
                href={d.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block truncate text-sm text-black/60 hover:text-black hover:underline"
              >
                {d.url}
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleDelete(d.uuid, d.name)}
            disabled={deleting === d.uuid}
            className="shrink-0 rounded-lg border border-black/10 px-3 py-1.5 text-sm text-black/60 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            {deleting === d.uuid ? "Deleting…" : "Delete"}
          </button>
        </li>
      ))}
    </ul>
  );
}
