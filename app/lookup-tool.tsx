"use client";

import { useState } from "react";

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS"];

export default function LookupTool() {
  const [host, setHost] = useState("example.com");
  const [type, setType] = useState("A");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function runLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!host.trim() || loading) return;

    setLoading(true);
    setIsError(false);
    setResult(null);

    try {
      const res = await fetch(
        `/api/lookup?host=${encodeURIComponent(host.trim())}&type=${type}`
      );
      const data = await res.json();
      setIsError(!res.ok);
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setIsError(true);
      setResult(
        `Request failed: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="lookup-form" onSubmit={runLookup}>
        <input
          type="text"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="hostname (e.g. example.com)"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {RECORD_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "…" : "Resolve"}
        </button>
      </form>

      <div className={`result${isError ? " error" : ""}`}>
        {result ?? (
          <span className="placeholder">
            Results will appear here. Try resolving a hostname above.
          </span>
        )}
      </div>

      <p className="meta">
        Tip: also reachable directly at{" "}
        <code>/api/lookup?host=example.com&amp;type=A</code>
      </p>
    </>
  );
}
