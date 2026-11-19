import { formatDateFull } from "../../../utils/format";

interface TopBarProps {
  title: string;
  dark: boolean;
  onToggleDark: () => void;
  onToggleSidebar: () => void;
}

export default function TopBar({
  title,
  dark,
  onToggleDark,
  onToggleSidebar,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#d8e5d8] bg-white px-4 dark:border-neutral-800 dark:bg-[#1a1b1d]">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="shrink-0 rounded-lg p-2 text-gray-600 hover:bg-[#edf4ed] dark:text-gray-300 dark:hover:bg-neutral-800"
          aria-label="Buka/tutup sidebar"
        >
          <i className="fas fa-bars"></i>
        </button>
        <h1 className="truncate text-lg font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden text-sm text-gray-500 md:block dark:text-gray-400">
          {formatDateFull(new Date())}
        </span>
        <button
          type="button"
          onClick={onToggleDark}
          className="rounded-lg p-2 text-gray-600 hover:bg-[#edf4ed] dark:text-gray-300 dark:hover:bg-neutral-800"
          aria-label="Ganti tema gelap/terang"
        >
          <i className={`fas ${dark ? "fa-sun" : "fa-moon"}`}></i>
        </button>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white"
          title="Pemilik toko"
        >
          M
        </div>
      </div>
    </header>
  );
}
