import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { registerUser } from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

// Mirror of server-side logic for instant feedback
const getStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
  if (password.length >= 16) score++;
  if (score <= 3) return { label: "Weak", color: "bg-red-500", width: "w-1/3" };
  if (score <= 5) return { label: "Medium", color: "bg-amber-500", width: "w-2/3" };
  return { label: "Strong", color: "bg-green-500", width: "w-full" };
};

const getRules = (password, username, dob) => [
  { label: "At least 8 characters", pass: password.length >= 8 },
  { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
  { label: "Lowercase letter", pass: /[a-z]/.test(password) },
  { label: "Number", pass: /[0-9]/.test(password) },
  { label: "Special character", pass: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  { label: "Not same as username", pass: password.toLowerCase() !== username.toLowerCase() && password.length > 0 },
  { label: "Does not contain date of birth", pass: dob ? !password.includes(dob.replace(/-/g, "")) : true },
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
    <div className="max-w-sm mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {errors.length > 0 && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 space-y-1">
              {errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Username</label>
            <Input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Choose a username"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Date of Birth</label>
            <Input
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Create a password"
                autoComplete="new-password"
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Strength meter */}
            {form.password && (
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                </div>
                <p className={`text-xs font-medium
                  ${strength.label === "Weak" ? "text-red-500" :
                    strength.label === "Medium" ? "text-amber-500" : "text-green-600"}`}>
                  {strength.label} password
                </p>
              </div>
            )}

            {/* Rule checklist */}
            {form.password && (
              <div className="space-y-1 pt-1">
                {rules.map((rule, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    {rule.pass
                      ? <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                      : <XCircle size={12} className="text-red-400 flex-shrink-0" />}
                    <span className={rule.pass ? "text-green-700" : "text-slate-400"}>
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading || rules.some((r) => !r.pass)}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>

          <p className="text-sm text-center text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}