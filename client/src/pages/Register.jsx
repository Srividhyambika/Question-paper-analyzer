import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { registerUser } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Eye, EyeOff, CheckCircle, XCircle, Brain, Shield, Zap, Users } from "lucide-react";

const getStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;
  if (password.length >= 16) score++;
  if (score <= 3) return { label: "Weak", color: "bg-red-500", width: "w-1/3", text: "text-red-500" };
  if (score <= 5) return { label: "Medium", color: "bg-yellow-500", width: "w-2/3", text: "text-yellow-500" };
  return { label: "Strong", color: "bg-green-500", width: "w-full", text: "text-green-600" };
};

const getRules = (password, username, dob) => [
  { label: "At least 8 characters", pass: password.length >= 8 },
  { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
  { label: "Lowercase letter", pass: /[a-z]/.test(password) },
  { label: "Number", pass: /[0-9]/.test(password) },
  { label: "Special character", pass: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
  { label: "Not same as username", pass: password.toLowerCase() !== username.toLowerCase() && password.length > 0 },
  { label: "Does not contain date of birth", pass: dob ? !password.includes(dob.replace(/-/g, "")) : true },
];

const perks = [
  { icon: Brain, text: "AI analysis on every question" },
  { icon: Shield, text: "Your data is secure and private" },
  { icon: Zap, text: "Results in under 3 minutes" },
  { icon: Users, text: "Built for students, by students" },
];

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "", dob: "", role: "student" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const strength = form.password ? getStrength(form.password) : null;
  const rules = getRules(form.password, form.username, form.dob);
  const allRulesPassed = rules.every((r) => r.pass);

  const handleSubmit = async () => {
    setErrors([]);
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) setErrors(serverErrors);
      else setErrors([err.response?.data?.message || "Registration failed."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/10 flex-col items-center justify-center px-12 relative overflow-hidden">
        <div className="absolute top-[-80px] left-[-80px] w-64 h-64 rounded-full bg-primary/10" />
        <div className="absolute bottom-[-60px] right-[-60px] w-48 h-48 rounded-full bg-accent/30" />

        {/* SVG */}
        <svg viewBox="0 0 400 300" className="w-full max-w-md mb-8" fill="none">
          <circle cx="200" cy="100" r="60" fill="hsl(217 60% 54% / 0.1)" stroke="hsl(217 60% 54% / 0.3)" strokeWidth="1.5" strokeDasharray="5 3" />
          <text x="200" y="115" textAnchor="middle" fontSize="48">📚</text>
          <rect x="80" y="180" width="240" height="6" rx="3" fill="hsl(217 60% 54% / 0.15)" />
          <rect x="100" y="196" width="200" height="4" rx="2" fill="hsl(217 60% 54% / 0.1)" />
          <rect x="120" y="208" width="160" height="4" rx="2" fill="hsl(217 60% 54% / 0.08)" />
          <circle cx="100" cy="140" r="8" fill="hsl(38 90% 55% / 0.4)" />
          <circle cx="310" cy="120" r="6" fill="hsl(217 60% 54% / 0.4)" />
          <circle cx="290" cy="170" r="4" fill="hsl(12 80% 62% / 0.5)" />
        </svg>

        <h2 className="text-2xl font-bold text-foreground text-center mb-2">
          Join thousands of students
          <span className="text-primary"> studying smarter</span>
        </h2>
        <p className="text-muted-foreground text-center text-sm mb-8 max-w-xs">
          Create your account and start analyzing papers in minutes.
        </p>

        <div className="space-y-2 w-full max-w-xs">
          {perks.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 bg-white/60 dark:bg-card/60 rounded-lg px-4 py-2.5">
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-primary" />
              </div>
              <span className="text-sm text-foreground">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Brain size={16} className="text-white" />
              </div>
              <span className="font-semibold text-foreground">Exam PYQ Analyzer</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create account</h1>
            <p className="text-muted-foreground text-sm mt-1">Start analyzing your papers today</p>
          </div>

          {errors.length > 0 && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 space-y-1">
              {errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Username</label>
            <Input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Choose a username"
              autoComplete="username"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Date of Birth</label>
            <Input
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Create a strong password"
                autoComplete="new-password"
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

            {form.password && (
              <div className="space-y-2 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Password strength</span>
                    <span className={`text-xs font-medium ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {rules.map((rule, i) => (
                    <div key={i} className="flex items-center gap-1 text-xs">
                      {rule.pass
                        ? <CheckCircle size={10} className="text-green-500 flex-shrink-0" />
                        : <XCircle size={10} className="text-red-400 flex-shrink-0" />}
                      <span className={rule.pass ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading || !allRulesPassed}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
