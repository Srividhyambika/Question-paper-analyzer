import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "../services/api";
import { useAuth } from "../store/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Users, Clock, Activity, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => getAdminStats().then((r) => r.data),
    refetchInterval: 30000, // refresh every 30s
  });

  if (isLoading) return <div className="text-center py-20 text-slate-400">Loading stats...</div>;
  if (error) return <div className="text-center py-20 text-red-400">Failed to load stats.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Visitor analytics and platform stats.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Activity size={18} className="text-blue-500" />}
          label="Total Visits"
          value={data.totalVisitors}
          bg="bg-blue-50"
        />
        <StatCard
          icon={<Clock size={18} className="text-amber-500" />}
          label="Avg Time Spent"
          value={data.avgDurationFormatted}
          bg="bg-amber-50"
        />
        <StatCard
          icon={<Users size={18} className="text-green-500" />}
          label="Registered Users"
          value={data.totalUsers}
          bg="bg-green-50"
        />
        <StatCard
          icon={<TrendingUp size={18} className="text-purple-500" />}
          label="Visits (7 days)"
          value={data.visitsPerDay.reduce((s, d) => s + d.count, 0)}
          bg="bg-purple-50"
        />
      </div>

      {/* Visits per day chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Visits Per Day (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {data.visitsPerDay.length === 0 ? (
            <p className="text-slate-400 text-sm">No visit data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.visitsPerDay} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="_id"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Visits" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Summary note */}
      <p className="text-xs text-slate-400">
        Stats refresh every 30 seconds. Average time spent is calculated from completed sessions only.
      </p>
    </div>
  );
}

function StatCard({ icon, label, value, bg }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className={`w-8 h-8 rounded-md ${bg} flex items-center justify-center mb-3`}>
          {icon}
        </div>
        <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value ?? "—"}</p>
      </CardContent>
    </Card>
  );
}