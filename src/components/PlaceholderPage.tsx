interface PlaceholderPageProps {
  title: string;
  phase: string;
}

// Halaman sementara Fase 0 — diganti halaman beneran di Fase 1-5.
export default function PlaceholderPage({ title, phase }: PlaceholderPageProps) {
  return (
    <div className="rounded-xl border border-[#d8e5d8] bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#1a1b1d]">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Segera hadir — {phase}. Layout, routing, dan fondasi API sudah siap.
      </p>
    </div>
  );
}
