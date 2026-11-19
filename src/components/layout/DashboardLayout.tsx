import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar.tsx";
import TopBar from "./TopBar.tsx";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("kasirku-theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("kasirku-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 dark:bg-neutral-950 dark:text-gray-100">
      <Sidebar collapsed={collapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          dark={dark}
          onToggleDark={() => setDark((prev) => !prev)}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
        />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
        <footer className="pb-4 text-center text-xs text-gray-400 dark:text-gray-500">
          KasirKu — POS sederhana
        </footer>
      </div>
    </div>
  );
}
