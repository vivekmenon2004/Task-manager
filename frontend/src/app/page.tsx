"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type ApiStatus = "checking" | "connected" | "offline";

export default function Home() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/api/health`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("API health check failed");
        setApiStatus("connected");
      })
      .catch(() => {
        if (!controller.signal.aborted) setApiStatus("offline");
      });

    return () => controller.abort();
  }, []);

  const statusLabel = {
    checking: "Checking API",
    connected: "API connected",
    offline: "API offline",
  }[apiStatus];

  return (
    <main className="min-h-screen bg-[#f7f7f4] px-5 py-6 text-[#20231f] sm:px-10 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-[#e5e6df] pb-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Task Manager home">
            <span className="grid size-10 place-items-center rounded-xl bg-[#1f513c] text-lg font-semibold text-white">
              T
            </span>
            <span className="text-base font-semibold tracking-tight">Task Manager</span>
          </Link>
          <div
            className="flex items-center gap-2 rounded-full border border-[#e5e6df] bg-white px-3 py-2 text-sm text-[#59635b]"
            role="status"
            aria-live="polite"
          >
            <span
              className={`size-2 rounded-full ${apiStatus === "connected" ? "bg-emerald-500" : apiStatus === "offline" ? "bg-rose-500" : "animate-pulse bg-amber-400"}`}
            />
            {statusLabel}
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-20">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#557260]">
              A calmer way to get things done
            </p>
            <h1 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-6xl">
              Make room for what matters.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[#68716a]">
              Keep your work in one place, set priorities, and move each task forward one step at a time.
            </p>
            <a
              href={`${API_URL}/api/health`}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1f513c] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#173e2e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f513c]"
            >
              View API health
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="rounded-2xl border border-[#e5e6df] bg-white p-6 shadow-[0_18px_60px_-40px_rgba(32,35,31,0.28)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#778078]">YOUR WORKSPACE</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Task list</h2>
              </div>
              <span className="rounded-full bg-[#eef4ef] px-3 py-1.5 text-xs font-medium text-[#38644a]">
                Ready to build
              </span>
            </div>
            <div className="mt-8 rounded-xl border border-dashed border-[#d9ded7] bg-[#fbfcfa] px-5 py-10 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#eef4ef] text-xl text-[#38644a]" aria-hidden="true">
                ✓
              </div>
              <h3 className="mt-4 font-semibold">Your workspace is ready</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#778078]">
                The app is up. Task creation and editing will appear here as the API is built.
              </p>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[#eef0eb] pt-5 text-sm">
              <span className="text-[#778078]">Backend address</span>
              <code className="rounded bg-[#f4f5f1] px-2 py-1 text-xs text-[#3b5142]">localhost:5000</code>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#e5e6df] py-5 text-sm text-[#899189]">
          Task Manager · Full-stack assignment
        </footer>
      </div>
    </main>
  );
}


