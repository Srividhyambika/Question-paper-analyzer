import { useState } from "react";
import { Button } from "../ui/button";
import { Download, Eye, X } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ExportReport({ paper, questions, analysisResult }) {
  const [preview, setPreview] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById("pdf-report");
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = (canvas.height * pageWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
    pdf.save(`${paper.title || "analysis"}-report.pdf`);
  };

  const diffColors = { easy: "#10b981", medium: "#f59e0b", hard: "#ef4444" };
  const bloomsLabel = ["", "Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"];

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setPreview(true)}
        className="flex items-center gap-1.5">
        <Eye size={14} /> Preview Report
      </Button>

      {preview && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="max-w-4xl mx-auto my-8 px-4">
            <div className="flex justify-between items-center mb-4">
              <Button onClick={handleDownload} className="flex items-center gap-2">
                <Download size={14} /> Download PDF
              </Button>
              <Button variant="outline" onClick={() => setPreview(false)}>
                <X size={14} />
              </Button>
            </div>

            {/* Report content — this gets captured */}
            <div
  id="pdf-report"
  className="bg-white text-slate-800 p-8 rounded-lg shadow space-y-6"
  style={{ colorScheme: "light" }}
>
              {/* Header */}
              <div className="border-b pb-4">
                <h1 className="text-2xl font-bold text-slate-800">{paper.title}</h1>
                <p className="text-slate-500 text-sm mt-1">
                  {paper.subject} {paper.year && `· ${paper.year}`} · {paper.totalQuestions} questions
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Generated on {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Summary */}
              <div>
                <h2 className="text-base font-semibold text-slate-700 mb-3">Summary</h2>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Total Questions", value: paper.totalQuestions },
                    { label: "Syllabus Coverage", value: `${analysisResult?.syllabusCoveragePercent ?? "—"}%` },
                    { label: "Out of Syllabus", value: analysisResult?.outOfSyllabusCount ?? "—" },
                    { label: "Difficulty Score", value: `${analysisResult?.overallDifficultyScore ?? "—"}/10` },
                  ].map((s, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500">{s.label}</p>
                      <p className="text-xl font-bold text-slate-800 mt-1">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              {analysisResult?.insights && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h2 className="text-sm font-semibold text-blue-700 mb-1">AI Insights</h2>
                  <p className="text-sm text-blue-800">{analysisResult.insights}</p>
                </div>
              )}

              {/* Question table */}
              <div>
                <h2 className="text-base font-semibold text-slate-700 mb-3">
                  Question Analysis
                </h2>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-200 px-2 py-1.5 text-left">Q#</th>
                      <th className="border border-slate-200 px-2 py-1.5 text-left">Question</th>
                      <th className="border border-slate-200 px-2 py-1.5 text-center">Marks</th>
                      <th className="border border-slate-200 px-2 py-1.5 text-center">Difficulty</th>
                      <th className="border border-slate-200 px-2 py-1.5 text-center">Bloom's</th>
                      <th className="border border-slate-200 px-2 py-1.5 text-center">Complexity</th>
                      <th className="border border-slate-200 px-2 py-1.5 text-center">In Syllabus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q) => (
                      <tr key={q._id} className="even:bg-slate-50">
                        <td className="border border-slate-200 px-2 py-1.5 font-medium">
                          {q.questionNumber}
                        </td>
                        <td className="border border-slate-200 px-2 py-1.5 max-w-xs">
                          <p className="line-clamp-2">{q.questionText}</p>
                        </td>
                        <td className="border border-slate-200 px-2 py-1.5 text-center">
                          {q.marks || "—"}
                        </td>
                        <td className="border border-slate-200 px-2 py-1.5 text-center">
                          <span style={{ color: diffColors[q.difficulty] }} className="font-medium">
                            {q.difficulty || "—"}
                          </span>
                        </td>
                        <td className="border border-slate-200 px-2 py-1.5 text-center">
                          {q.bloomsLevel?.level
                            ? `L${q.bloomsLevel.level} · ${bloomsLabel[q.bloomsLevel.level]}`
                            : "—"}
                        </td>
                        <td className="border border-slate-200 px-2 py-1.5 text-center font-medium">
                          {q.cognitiveComplexity?.score ?? "—"}
                        </td>
                        <td className="border border-slate-200 px-2 py-1.5 text-center">
                          {q.isOutOfSyllabus
                            ? <span className="text-red-500 font-medium">No</span>
                            : <span className="text-green-600 font-medium">Yes</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Topics */}
              {analysisResult?.topicsCovered?.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold text-slate-700 mb-2">Topics Covered</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.topicsCovered.map((t, i) => (
                      <span key={i} className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
