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

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const cartCount = useCartCount();
  // Label selalu tampil di mobile (drawer), di desktop ikut collapse
  const labelClass = collapsed ? "md:hidden" : "";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen shrink-0 flex-col border-r border-[#d8e5d8] bg-white transition-[width,transform] duration-300 dark:border-neutral-800 dark:bg-[#1a1b1d] md:static md:z-auto md:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-[106%]"
      } w-[264px] ${collapsed ? "md:w-[76px]" : "md:w-[232px]"}`}
    >
      <div className="flex h-16 items-center gap-2 border-b border-[#d8e5d8] px-4 dark:border-neutral-800">
        <i className="fas fa-store text-xl text-green-600"></i>
        <span
          className={`text-lg font-bold text-gray-800 dark:text-gray-100 ${labelClass}`}
        >
          KasirKu
        </span>
        <button
          type="button"
          onClick={onCloseMobile}
          className="ml-auto rounded-lg p-2 text-gray-500 hover:bg-[#edf4ed] md:hidden dark:text-gray-400 dark:hover:bg-neutral-800"
          aria-label="Tutup menu"
        >
          <i className="fas fa-xmark"></i>
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        <p
          className={`px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 ${labelClass}`}
        >
          Menu
        </p>
        {menus.map((menu) => (
          <NavLink
            key={menu.to}
            to={menu.to}
            end={menu.end}
            title={menu.label}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-600 hover:bg-[#edf4ed] dark:text-gray-300 dark:hover:bg-neutral-800"
              }`
            }
          >
            <span className="relative shrink-0">
              <i className={`fas ${menu.icon} w-5 text-center`}></i>
              {menu.to === "/kasir" && cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </span>
            <span className={labelClass}>{menu.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
