import { NextRequest, NextResponse } from "next/server";
import dns from "node:dns/promises";

// Force the Node.js runtime — node:dns is not available on the Edge runtime.
export const runtime = "nodejs";
// Never cache: we want a fresh resolution on every request.
export const dynamic = "force-dynamic";

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS"] as const;
type RecordType = (typeof RECORD_TYPES)[number];

function isRecordType(value: string): value is RecordType {
  return (RECORD_TYPES as readonly string[]).includes(value);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const host = (searchParams.get("host") ?? "").trim();
  const typeParam = (searchParams.get("type") ?? "A").toUpperCase();

  if (!host) {
    return NextResponse.json(
      { error: "Missing ?host= query parameter." },
      { status: 400 }
    );
  }

  if (!isRecordType(typeParam)) {
    return NextResponse.json(
      { error: `Unsupported record type "${typeParam}". Try one of: ${RECORD_TYPES.join(", ")}.` },
      { status: 400 }
    );
  }

  const startedAt = performance.now();
  try {
    const records = await dns.resolve(host, typeParam);
    const elapsedMs = Math.round((performance.now() - startedAt) * 100) / 100;

    return NextResponse.json({
      host,
      type: typeParam,
      records,
      count: Array.isArray(records) ? records.length : 1,
      elapsedMs,
      resolvedAt: new Date().toISOString(),
      servers: dns.getServers(),
    });
  } catch (err) {
    const elapsedMs = Math.round((performance.now() - startedAt) * 100) / 100;
    const code = (err as NodeJS.ErrnoException).code ?? "UNKNOWN";
    return NextResponse.json(
      {
        host,
        type: typeParam,
        error: `DNS resolution failed (${code}).`,
        elapsedMs,
        servers: dns.getServers(),
      },
      { status: 502 }
    );
  }
}
