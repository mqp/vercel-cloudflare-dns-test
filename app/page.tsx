import LookupTool from "./lookup-tool";

export default function Home() {
  return (
    <main>
      <h1>DNS Test Bench</h1>
      <p className="subtitle">
        A tiny Next.js app for poking at DNS resolution. The lookup runs
        server-side via <code>node:dns</code>, so it resolves from wherever this
        app is deployed.
      </p>
      <LookupTool />
    </main>
  );
}
