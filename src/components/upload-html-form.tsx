"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button, Input } from "@heroui/react";
import { DeployResult, type DeployResultData } from "./deploy-result";
import { DomainPreview } from "./domain-preview";

export function UploadHtmlForm() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DeployResultData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (result) {
    return <DeployResult result={result} onReset={() => setResult(null)} />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Choose an .html file first.");
      return;
    }
    setLoading(true);
    setError(null);

    const form = new FormData();
    form.append("file", file);
    if (name) form.append("name", name);

    try {
      const res = await fetch("/api/deploy/static", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Deployment failed.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deployment failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <motion.div
        animate={{ scale: dragOver ? 1.01 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) setFile(dropped);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
          dragOver ? "border-accent bg-accent-soft" : "border-border hover:border-foreground/25"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".html,text/html"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <svg viewBox="0 0 24 24" fill="none" className="mb-1 h-6 w-6 text-foreground/35">
          <path d="M12 16V4M12 4L7 9M12 4l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {file ? (
          <>
            <span className="font-medium">{file.name}</span>
            <span className="text-sm text-foreground/45">
              {(file.size / 1024).toFixed(1)} KB — click to choose a different file
            </span>
          </>
        ) : (
          <>
            <span className="font-medium">Drop your .html file here</span>
            <span className="text-sm text-foreground/45">or click to browse — max 2MB</span>
          </>
        )}
      </motion.div>

      <div className="space-y-1.5">
        <Input
          placeholder="Site name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <DomainPreview name={name || file?.name.replace(/\.html?$/i, "") || ""} />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" variant="primary" isDisabled={loading} fullWidth>
        {loading ? "Deploying…" : "Deploy this page"}
      </Button>
    </form>
  );
}
