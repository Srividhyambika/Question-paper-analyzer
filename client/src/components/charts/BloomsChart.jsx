import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const COLORS = ["#6366f1", "#3b82f6", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

export default function BloomsChart({ data }) {
  if (!data) return null;

  const chartData = [
    { name: "Remember", value: data.remember },
    { name: "Understand", value: data.understand },
    { name: "Apply", value: data.apply },
    { name: "Analyze", value: data.analyze },
    { name: "Evaluate", value: data.evaluate },
    { name: "Create", value: data.create },
  ].filter((d) => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Bloom's Taxonomy Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
