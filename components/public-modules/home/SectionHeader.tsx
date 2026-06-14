// ─── Section Header ───────────────────────────────────────────────────────────

export function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 mb-4">
      <div className="h-px w-8 bg-emerald-500/70" />
      <p className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold tracking-[0.2em] uppercase">
        {label}
      </p>
    </div>
  );
}