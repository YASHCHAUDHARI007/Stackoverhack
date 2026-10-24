import React, { Suspense } from "react";
import { InvestigationWorkspace } from "@/components/investigation/InvestigationWorkspace";
import { AppShell } from "@/components/layout/AppShell";
import { Loader2 } from "lucide-react";

export function generateStaticParams() {
  return [
    { id: "INV-8042" },
    { id: "INV-7918" },
    { id: "INV-7840" },
    { id: "INV-7731" },
    { id: "INV-7620" },
    { id: "INV-7509" },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InvestigationDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="py-24 text-center space-y-3 font-mono">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
            <p className="text-sm text-slate-400">Loading diagnostic workspace...</p>
          </div>
        </AppShell>
      }
    >
      <InvestigationWorkspace id={id} />
    </Suspense>
  );
}
