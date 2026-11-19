import { NavLink } from "react-router";
import { useCartCount } from "../../lib/cartCount";

const menus = [
  { to: "/", label: "Dashboard", icon: "fa-gauge-high", end: true },
  { to: "/kasir", label: "Kasir", icon: "fa-cash-register", end: false },
  { to: "/produk", label: "Produk", icon: "fa-boxes-stacked", end: false },
  { to: "/restok", label: "Restok", icon: "fa-truck-ramp-box", end: false },
  { to: "/pengeluaran", label: "Pengeluaran", icon: "fa-money-bill-wave", end: false },
  { to: "/laporan", label: "Laporan", icon: "fa-chart-line", end: false },
];

// Tabbar bawah untuk mobile (ala prototype) — 6 menu yang sama
export default function MobileTabBar() {
  const cartCount = useCartCount();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[#d8e5d8] bg-white pb-[env(safe-area-inset-bottom)] md:hidden dark:border-neutral-800 dark:bg-[#1a1b1d]">
      {menus.map((menu) => (
        <NavLink
          key={menu.to}
          to={menu.to}
          end={menu.end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
              isActive
                ? "text-green-700 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
            }`
          }
        >
          <span className="relative">
            <i className={`fas ${menu.icon} text-base`}></i>
            {menu.to === "/kasir" && cartCount > 0 && (
              <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </span>
          {menu.label}
        </NavLink>
      ))}
    </nav>
  );
}
