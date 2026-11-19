interface TopBarProps {
  dark: boolean;
  onToggleDark: () => void;
  onToggleSidebar: () => void;
}

export default function TopBar({ dark, onToggleDark, onToggleSidebar }: TopBarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-900">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
        aria-label="Buka/tutup sidebar"
      >
        <i className="fas fa-bars"></i>
      </button>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleDark}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
          aria-label="Ganti tema gelap/terang"
        >
          <i className={`fas ${dark ? "fa-sun" : "fa-moon"}`}></i>
        </button>
        <div className="flex items-center gap-2 rounded-lg px-2 py-1">
          <i className="fas fa-circle-user text-2xl text-green-600"></i>
          <span className="hidden text-sm font-medium text-gray-700 sm:block dark:text-gray-200">
            Kasir
          </span>
        </div>
      </div>
    </header>
  );
}
