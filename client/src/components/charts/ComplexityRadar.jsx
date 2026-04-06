import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function ComplexityRadar({ data }) {
  if (!data) return null;

  const chartData = [
    { subject: "Surface", value: data.surface || 0, fullMark: 10 },
    { subject: "Intermediate", value: data.intermediate || 0, fullMark: 10 },
    { subject: "Deep", value: data.deep || 0, fullMark: 10 },
    { subject: "Complex", value: data.complex || 0, fullMark: 10 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cognitive Complexity Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            />
            <Radar
              name="Questions"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
