import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUploadHistory, comparePapers } from "../services/api";
import { Button } from "../components/ui/button";
import SummaryCard from "../components/dashboard/SummaryCard";

export default function Compare() {
  const [selected, setSelected] = useState([]);
  const [compareData, setCompareData] = useState(null);

  const { data: history } = useQuery({
    queryKey: ["history"],
    queryFn: () => getUploadHistory().then((r) => r.data),
  });

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const handleCompare = async () => {
    const { data } = await comparePapers(selected);
    setCompareData(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Compare Papers</h1>
        <p className="text-slate-500 text-sm mt-1">Select exactly 2 papers to compare.</p>
      </div>

      <div className="space-y-2">
        {history?.map((paper) => (
          <div
            key={paper._id}
            onClick={() => toggle(paper._id)}
            className={`cursor-pointer border rounded-lg px-4 py-3 text-sm transition-colors
              ${selected.includes(paper._id)
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
          >
            {paper.title} {paper.year && `(${paper.year})`} · {paper.subject}
          </div>
        ))}
      </div>

      <Button disabled={selected.length !== 2} onClick={handleCompare}>
        Compare Selected
      </Button>

      {compareData && (
        <div className="grid grid-cols-2 gap-6 mt-6">
          {compareData.map(({ paper, analysisResult }) => (
            <div key={paper._id} className="space-y-3">
              <h2 className="font-semibold text-slate-700">{paper.title}</h2>
              <SummaryCard label="Questions" value={paper.totalQuestions} />
              <SummaryCard label="Total Marks" value={paper.totalMarks} />
              <SummaryCard
                label="Syllabus Coverage"
                value={analysisResult ? `${analysisResult.syllabusCoveragePercent}%` : "—"}
              />
              <SummaryCard
                label="Out of Syllabus"
                value={analysisResult ? analysisResult.outOfSyllabusCount : "—"}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}