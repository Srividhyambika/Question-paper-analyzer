import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { loginUser } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Eye, EyeOff, BookOpen, Brain, TrendingUp } from "lucide-react";

const features = [
  { icon: BookOpen, text: "Analyze question papers instantly" },
  { icon: Brain, text: "AI-powered Bloom's taxonomy mapping" },
  { icon: TrendingUp, text: "Track syllabus coverage & difficulty" },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/10 dark:bg-primary/5 flex-col items-center justify-center px-12 relative overflow-hidden dark:border-r dark:border-primary/20 dark:shadow-[4px_0_30px_hsl(199_100%_55%/0.08)]">

        {/* Background circles */}
        <div className="absolute top-[-80px] left-[-80px] w-64 h-64 rounded-full bg-primary/10" />
        <div className="absolute bottom-[-60px] right-[-60px] w-48 h-48 rounded-full bg-accent/30" />

        {/* SVG Illustration */}
        <svg viewBox="0 0 400 320" className="w-full max-w-md mb-8" fill="none">
          {/* Desk */}
          <rect x="60" y="240" width="280" height="12" rx="4" fill="hsl(217 60% 54% / 0.15)" />
          {/* Laptop body */}
          <rect x="120" y="160" width="160" height="100" rx="8" fill="hsl(217 60% 54% / 0.2)" stroke="hsl(217 60% 54%)" strokeWidth="2" />
          {/* Laptop screen */}
          <rect x="128" y="168" width="144" height="76" rx="4" fill="white" />
          {/* Screen content lines */}
          <rect x="136" y="178" width="80" height="6" rx="3" fill="hsl(217 60% 54% / 0.4)" />
          <rect x="136" y="190" width="60" height="4" rx="2" fill="hsl(217 60% 54% / 0.2)" />
          <rect x="136" y="200" width="100" height="4" rx="2" fill="hsl(217 60% 54% / 0.2)" />
          <rect x="136" y="210" width="70" height="4" rx="2" fill="hsl(217 60% 54% / 0.2)" />
          {/* Chart bar on screen */}
          <rect x="230" y="206" width="12" height="24" rx="2" fill="hsl(217 60% 54% / 0.5)" />
          <rect x="246" y="196" width="12" height="34" rx="2" fill="hsl(217 60% 54%)" />
          <rect x="214" y="214" width="12" height="16" rx="2" fill="hsl(38 90% 55% / 0.7)" />
          {/* Laptop base */}
          <rect x="108" y="260" width="184" height="8" rx="4" fill="hsl(217 60% 54% / 0.3)" />
          {/* Books stack */}
          <rect x="72" y="210" width="44" height="8" rx="2" fill="hsl(12 80% 62% / 0.7)" />
          <rect x="68" y="220" width="48" height="8" rx="2" fill="hsl(142 60% 45% / 0.6)" />
          <rect x="72" y="230" width="44" height="10" rx="2" fill="hsl(217 60% 54% / 0.5)" />
          {/* Floating sparkles */}
          <circle cx="320" cy="130" r="5" fill="hsl(38 90% 55%)" opacity="0.7" />
          <circle cx="100" cy="150" r="4" fill="hsl(217 60% 54%)" opacity="0.5" />
          <circle cx="340" cy="180" r="3" fill="hsl(12 80% 62%)" opacity="0.6" />
          {/* Brain/AI icon area */}
          <circle cx="200" cy="80" r="40" fill="hsl(217 60% 54% / 0.1)" stroke="hsl(217 60% 54% / 0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="200" y="88" textAnchor="middle" fontSize="28">🧠</text>
        </svg>

        {/* Tagline */}
        <h2 className="text-2xl font-bold text-foreground text-center mb-2">
          Turn PYQs into your
          <span className="text-primary"> exam strategy</span>
        </h2>
        <p className="text-muted-foreground text-center text-sm mb-8 max-w-xs">
          AI-powered analysis that tells you exactly what to study and how hard it'll be.
        </p>

        {/* Feature pills */}
        <div className="space-y-2 w-full max-w-xs">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-2.5">
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-primary" />
              </div>
              <span className="text-sm text-foreground">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 bg-white/60 dark:bg-card dark:neon-card rounded-lg px-4 py-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Brain size={16} className="text-white" />
              </div>
              <span className="font-semibold text-foreground">Exam PYQ Analyzer</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to continue analyzing</p>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Username</label>
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
