import { Badge } from "../ui/badge";

const difficultyColor = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
};

const bloomsLabel = ["", "Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"];

export default function QuestionTable({ questions }) {
  if (!questions?.length) {
    return <p className="text-slate-400 text-sm">No questions found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Q#</th>
            <th className="px-4 py-3 text-left">Question</th>
            <th className="px-4 py-3 text-center">Marks</th>
            <th className="px-4 py-3 text-center">Difficulty</th>
            <th className="px-4 py-3 text-center">Bloom's</th>
            <th className="px-4 py-3 text-center">Complexity</th>
            <th className="px-4 py-3 text-center">In Syllabus</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {questions.map((q) => (
            <tr key={q._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                {q.questionNumber}
              </td>
              <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                {q.questionText}
              </td>
              <td className="px-4 py-3 text-center text-slate-600">{q.marks || "—"}</td>
              <td className="px-4 py-3 text-center">
                {q.difficulty ? (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor[q.difficulty]}`}>
                    {q.difficulty}
                  </span>
                ) : "—"}
              </td>
              <td className="px-4 py-3 text-center text-slate-500">
                {q.bloomsLevel?.level
                  ? `L${q.bloomsLevel.level} · ${bloomsLabel[q.bloomsLevel.level]}`
                  : "—"}
              </td>
              <td className="px-4 py-3 text-center text-slate-500">
                {q.cognitiveComplexity?.score ?? "—"}
              </td>
              <td className="px-4 py-3 text-center">
                {q.isOutOfSyllabus === undefined ? "—" : q.isOutOfSyllabus ? (
                  <span className="text-red-500 font-medium">No</span>
                ) : (
                  <span className="text-green-600 font-medium">Yes</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}