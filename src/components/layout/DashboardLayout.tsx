import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import Sidebar from "./Sidebar.tsx";
import TopBar from "./TopBar.tsx";
import MobileTabBar from "./MobileTabBar.tsx";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/kasir": "Kasir",
  "/produk": "Produk",
  "/restok": "Restok / Belanja Stok",
  "/pengeluaran": "Pengeluaran",
  "/laporan": "Laporan",
};

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("kasirku-theme") === "dark";
  });
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("kasirku-theme", dark ? "dark" : "light");
  }, [dark]);

  // Tutup drawer saat pindah halaman di mobile
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Hamburger: buka drawer di mobile, collapse di desktop
  const handleHamburger = () => {
    if (window.innerWidth < 768) setMobileOpen(true);
    else setCollapsed((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-[#f3f7f3] text-gray-800 dark:bg-[#101112] dark:text-gray-100">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title={titles[location.pathname] ?? "KasirKu"}
          dark={dark}
          onToggleDark={() => setDark((prev) => !prev)}
          onToggleSidebar={handleHamburger}
        />
        <main className="flex-1 p-4 pb-20 sm:p-6 md:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
