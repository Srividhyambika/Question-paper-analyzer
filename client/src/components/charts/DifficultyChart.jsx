import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const COLORS = { easy: "#10b981", medium: "#f59e0b", hard: "#ef4444" };

export default function DifficultyChart({ data }) {
  if (!data) return null;

  const chartData = [
    { name: "Easy", value: data.easy, color: COLORS.easy },
    { name: "Medium", value: data.medium, color: COLORS.medium },
    { name: "Hard", value: data.hard, color: COLORS.hard },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Difficulty Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} barCategoryGap="40%">
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}