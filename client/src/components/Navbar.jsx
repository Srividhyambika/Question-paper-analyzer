import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, History, BarChart2, ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "../store/useAuth";
import { Button } from "./ui/button";
import { useTheme } from "../store/useTheme";
import { Sun, Moon } from "lucide-react";
import Avatar from "./ui/Avatar";

const links = [
  { to: "/", label: "Upload", icon: BookOpen },
  { to: "/history", label: "History", icon: History },
  { to: "/compare", label: "Compare", icon: BarChart2 },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { dark, setDark } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 neon-navbar">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-slate-800 text-lg tracking-tight">
          Exam <span className="text-blue-600">PYQ</span> Analyzer
        </Link>

        <div className="flex items-center gap-1">
          {user && links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
  ${pathname === to ? "bg-blue-50 text-blue-600 dark:bg-primary/20 dark:text-primary" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-secondary"}`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${pathname === "/admin"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100"}`}
            >
              <ShieldCheck size={15} />
              Admin
            </Link>
          )}
          <button
  onClick={() => setDark(!dark)}
  className={`p-1.5 rounded-md transition-colors
    ${dark
      ? "text-yellow-400 hover:bg-secondary shadow-[0_0_10px_hsl(48_100%_55%/0.3)]"
      : "text-muted-foreground hover:bg-secondary"
    }`}
>
  {dark ? <Sun size={15} /> : <Moon size={15} />}
</button>

          {user ? (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <button
  onClick={() => navigate("/profile")}
  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
>
  <Avatar avatar={user?.avatar} username={user?.username} size="sm" />
  <span className="text-xs text-muted-foreground dark:text-slate-300 hidden sm:block">
    {user?.username}
  </span>
</button>
              <Button size="sm" variant="ghost" onClick={handleLogout}>
                <LogOut size={14} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Button size="sm" variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
