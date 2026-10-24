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

async function InvestigationWorkspaceContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InvestigationWorkspace id={id} />;
}

export default function InvestigationDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="py-24 text-center space-y-3 font-mono">
            <Loader2 className="w-8 h-8 animate-spin text-[#A8AAA5] mx-auto" />
            <p className="text-sm text-[#777A76]">Loading diagnostic workspace...</p>
          </div>
        </AppShell>
      }
    >
      <InvestigationWorkspaceContent params={params} />
    </Suspense>
  );
}
