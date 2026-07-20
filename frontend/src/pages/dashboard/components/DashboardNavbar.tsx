import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SquareKanban, Users, Ticket, LogOut, LayoutDashboard, BarChart3, Building2 } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

function DashboardNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItemsSoftware = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Teams", to: "/teams", icon: Users },
    { label: "My Tickets", to: "/mytickets", icon: Ticket },
  ];

  const navItemsAdmin = [
     { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Manage Users", to: "/admin/users", icon: Users },
    { label: "Manage Teams", to: "/admin/teams", icon: Building2 },
  ];

  const navItemsPM = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Teams", to: "/teams", icon: Users },
    { label: "Reports", to: "/reports", icon: BarChart3 },
  ];

  const navItems =
    user?.role === "ADMIN"
      ? navItemsAdmin
      : user?.role === "PROJECT_MANAGER"
      ? navItemsPM
      : navItemsSoftware;

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-slate-200 bg-white px-4 py-6">
      <div>
        <div className="mb-8 flex items-center gap-2 px-2">
          <SquareKanban className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-slate-900">TaskFlow</span>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="relative" ref={menuRef}>
        {menuOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-full rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-100"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            {initial}
          </div>
          <span className="truncate text-sm font-medium text-slate-700">
            {user?.name ?? "User"}
          </span>
        </button>
      </div>
    </aside>
  );
}

export default DashboardNavbar;