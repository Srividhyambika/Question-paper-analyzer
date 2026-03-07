import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, History, BarChart2, ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "../store/useAuth";
import { Button } from "./ui/button";

const links = [
  { to: "/", label: "Upload", icon: BookOpen },
  { to: "/history", label: "History", icon: History },
  { to: "/compare", label: "Compare", icon: BarChart2 },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
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
                ${pathname === to
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100"}`}
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

          {user ? (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <span className="text-xs text-slate-500">{user.username}</span>
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