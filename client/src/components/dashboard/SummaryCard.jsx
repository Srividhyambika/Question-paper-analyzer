import { Card, CardContent } from "../ui/card";

export default function SummaryCard({ label, value, highlight }) {
  return (
    <Card className={highlight ? "border-red-200 bg-red-50" : ""}>
      <CardContent className="pt-4 pb-4">
        <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${highlight ? "text-red-600" : "text-slate-800"}`}>
          {value ?? "—"}
        </p>
      </CardContent>
    </Card>
  );
}