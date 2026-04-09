import { useState } from "react";
import { Badge } from "../ui/badge";
import { Tooltip } from "../ui/tooltip";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from "lucide-react";
import { updateQuestionNotes } from "../../services/api";
import { Pencil, Save } from "lucide-react";
import toast from "react-hot-toast";

const difficultyConfig = {
  easy:   { label: "Easy",   bg: "bg-success-soft",  text: "text-success",  bar: "bg-green-400",  width: "w-1/3"  },
  medium: { label: "Medium", bg: "bg-warning-soft",  text: "text-warning",  bar: "bg-yellow-400", width: "w-2/3"  },
  hard:   { label: "Hard",   bg: "bg-coral-soft",    text: "text-coral",    bar: "bg-red-400",    width: "w-full" },
};

const bloomsLabel = ["", "Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"];
const bloomsColor = ["", "bg-slate-100 text-slate-600", "bg-blue-50 text-blue-600",
  "bg-indigo-50 text-indigo-600", "bg-purple-50 text-purple-600",
  "bg-pink-50 text-pink-600", "bg-rose-50 text-rose-700"];

const complexityColor = (score) => {
  if (!score) return "text-muted-foreground";
  if (score >= 8) return "text-coral font-bold";
  if (score >= 5) return "text-warning font-semibold";
  return "text-success font-medium";
};

function ComplexityBar({ score }) {
  const pct = score ? Math.round((score / 10) * 100) : 0;
  const color = score >= 8 ? "bg-red-400" : score >= 5 ? "bg-yellow-400" : "bg-green-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs w-4 ${complexityColor(score)}`}>{score ?? "—"}</span>
    </div>
  );
}

function NotesField({ question }) {
  const [notes, setNotes] = useState(question.notes || "");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
  setSaving(true);
  try {
    await updateQuestionNotes(question._id, notes);
    setEditing(false);
    toast.success("Notes saved.");
  } catch {
    toast.error("Failed to save notes.");
  } finally {
    setSaving(false);
  }
  };
  return (
    <div className="col-span-2 md:col-span-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">My Notes</p>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-primary flex items-center gap-1 hover:underline"
          >
            <Pencil size={10} /> Edit
          </button>
        ) : (
          <button
            onClick={save}
            disabled={saving}
            className="text-xs text-green-600 flex items-center gap-1 hover:underline"
          >
            <Save size={10} /> {saving ? "Saving..." : "Save"}
          </button>
        )}
      </div>
      {editing ? (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add your notes for this question..."
          className="w-full text-xs border border-input rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          rows={3}
        />
      ) : (
        <p className="text-xs text-foreground bg-white dark:bg-card rounded-lg px-3 py-2 border border-border min-h-8">
          {notes || <span className="text-muted-foreground italic">No notes yet. Click Edit to add.</span>}
        </p>
      )}
    </div>
  );
}

function QuestionCard({ q, index }) {
  const [expanded, setExpanded] = useState(false);
  const diff = difficultyConfig[q.difficulty] || {};
  const bloomLevel = q.bloomsLevel?.level;

  return (
    <div className={`bg-card border rounded-xl overflow-hidden card-hover neon-card
  ${q.isOutOfSyllabus ? "border-red-200 dark:border-red-500/30" : "border-border"}`}>

      {/* Card header */}
      <div
        className="px-4 py-3 flex items-start gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Question number badge */}
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">{q.questionNumber}</span>
        </div>

        {/* Question text */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm text-foreground ${expanded ? "" : "line-clamp-2"}`}>
            {q.questionText}
          </p>
        </div>

        {/* Right side: tags + expand */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {q.isOutOfSyllabus && (
            <Tooltip content="This question appears to be outside the syllabus">
              <AlertTriangle size={14} className="text-coral" />
            </Tooltip>
          )}
          {q.marks > 0 && (
            <span className="text-xs bg-accent/30 text-foreground font-medium px-2 py-0.5 rounded-full">
              {q.marks}M
            </span>
          )}
          {expanded ? <ChevronUp size={15} className="text-muted-foreground" /> : <ChevronDown size={15} className="text-muted-foreground" />}
        </div>
      </div>

      {/* Collapsed summary row */}
      {!expanded && (
        <div className="px-4 pb-3 flex items-center gap-3 flex-wrap">
          {q.difficulty && (
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>
              {diff.label}
            </span>
          )}
          {bloomLevel && (
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${bloomsColor[bloomLevel]}`}>
              L{bloomLevel} · {bloomsLabel[bloomLevel]}
            </span>
          )}
          {q.cognitiveComplexity?.score && (
            <div className="flex items-center gap-1.5 flex-1 min-w-24 max-w-32">
              <span className="text-xs text-muted-foreground">Complexity</span>
              <ComplexityBar score={q.cognitiveComplexity.score} />
            </div>
          )}
          <div className="ml-auto flex items-center gap-1">
            {q.isOutOfSyllabus === false && q.syllabusMatch?.matched ? (
              <CheckCircle size={12} className="text-success" />
            ) : null}
            {q.syllabusMatch?.topic && (
              <span className="text-xs text-muted-foreground truncate max-w-32">
                {q.syllabusMatch.topic}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border bg-slate-50/50 px-4 py-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Difficulty</p>
            <span className={`text-sm font-semibold ${diff.text}`}>{diff.label || "—"}</span>
            {q.difficulty && (
              <div className="mt-1.5 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${diff.bar} ${diff.width}`} />
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Bloom's Level</p>
            {bloomLevel ? (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${bloomsColor[bloomLevel]}`}>
                L{bloomLevel} · {bloomsLabel[bloomLevel]}
              </span>
            ) : <span className="text-sm text-muted-foreground">—</span>}
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Complexity</p>
            <ComplexityBar score={q.cognitiveComplexity?.score} />
            {q.cognitiveComplexity?.thinkingType && (
              <p className="text-xs text-muted-foreground mt-1 capitalize">
                {q.cognitiveComplexity.thinkingType}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Syllabus Match</p>
            <div className="flex items-center gap-1.5">
              {q.isOutOfSyllabus
                ? <span className="text-xs text-coral font-medium">Out of syllabus</span>
                : <span className="text-xs text-success font-medium">✓ {q.syllabusMatch?.topic || "Matched"}</span>
              }
            </div>
            {q.syllabusMatch?.confidence > 0 && (
              <div className="mt-1.5 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${q.syllabusMatch.confidence}%` }}
                />
              </div>
            )}
          </div>

          {q.syllabusMatch?.unit && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Unit</p>
              <p className="text-sm text-foreground">{q.syllabusMatch.unit}</p>
            </div>
          )}

          {q.cognitiveComplexity?.reasoning && (
            <div className="col-span-2 md:col-span-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">AI Reasoning</p>
              <p className="text-xs text-foreground leading-relaxed bg-white rounded-lg px-3 py-2 border border-border">
                {q.cognitiveComplexity.reasoning}
              </p>
            </div>
            
          )}
          {expanded && <NotesField question={q} />}

        </div>
      )}
    </div>
  );
}

export default function QuestionTable({ questions }) {
  const [search, setSearch] = useState("");
const [filterDifficulty, setFilterDifficulty] = useState("all");
const [filterBlooms, setFilterBlooms] = useState("all");

const filtered = questions.filter((q) => {
  const matchSearch = search === "" ||
    q.questionText?.toLowerCase().includes(search.toLowerCase()) ||
    q.questionNumber?.toLowerCase().includes(search.toLowerCase());
  const matchDiff = filterDifficulty === "all" || q.difficulty === filterDifficulty;
  const matchBlooms = filterBlooms === "all" ||
    q.bloomsLevel?.label?.toLowerCase() === filterBlooms.toLowerCase();
  return matchSearch && matchDiff && matchBlooms;
});
  if (!questions?.length) {
    return <p className="text-muted-foreground text-sm">No questions found.</p>;
  }

  const analyzed = filtered.filter((q) => q.difficulty).length;
const progressPct = filtered.length > 0
  ? Math.round((analyzed / filtered.length) * 100)
  : 0;

  return (
    <div className="space-y-3">
      {/* Search & Filter bar */}
<div className="flex flex-wrap gap-2 mb-1">
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search questions..."
    className="flex h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm flex-1 min-w-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground placeholder:text-muted-foreground"
  />
  <select
    value={filterDifficulty}
    onChange={(e) => setFilterDifficulty(e.target.value)}
    className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <option value="all">All Difficulties</option>
    <option value="easy">Easy</option>
    <option value="medium">Medium</option>
    <option value="hard">Hard</option>
  </select>
  <select
    value={filterBlooms}
    onChange={(e) => setFilterBlooms(e.target.value)}
    className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <option value="all">All Bloom's Levels</option>
    {["Remember","Understand","Apply","Analyze","Evaluate","Create"].map((l) => (
      <option key={l} value={l}>{l}</option>
    ))}
  </select>
  {(search || filterDifficulty !== "all" || filterBlooms !== "all") && (
    <button
      onClick={() => { setSearch(""); setFilterDifficulty("all"); setFilterBlooms("all"); }}
      className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground border border-input rounded-lg transition-colors"
    >
      Clear
    </button>
  )}
</div>
      {/* Progress bar gamification */}
      <div className="bg-card border border-border rounded-xl px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Analysis Progress</span>
            <span className="text-xs text-muted-foreground">
              {analyzed}/{questions.length} questions analyzed
            </span>
          </div>
          <span className="text-sm font-bold text-primary">{progressPct}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {progressPct === 100 && (
          <p className="text-xs text-success mt-1.5 flex items-center gap-1">
            <CheckCircle size={11} /> All questions fully analyzed
          </p>
        )}
      </div>

      {/* Question cards */}
      {questions.map((q, i) => (
        <QuestionCard key={q._id} q={q} index={i} />
      ))}
    </div>
  );
}
