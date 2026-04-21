import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getResults } from "../services/api";
import SummaryCard from "../components/dashboard/SummaryCard";
import QuestionTable from "../components/dashboard/QuestionTable";
import BloomsChart from "../components/charts/BloomsChart";
import DifficultyChart from "../components/charts/DifficultyChart";
import AgentChat from "../components/agent/AgentChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import AnalysisSkeleton from "../components/dashboard/AnalysisSkeleton";
import TopicsCoverage from "../components/dashboard/TopicsCoverage";
import ExportReport from "../components/dashboard/ExportReport";
import ComplexityRadar from "../components/charts/ComplexityRadar";
import { Printer } from "lucide-react";
import GenAIPanel from "../components/dashboard/GenAIPanel";
import { Sparkles, BarChart2, BookOpen, Bot, List } from "lucide-react";

export default function Analysis() {
  const { paperId } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["results", paperId],
    queryFn: () => getResults(paperId).then((r) => r.data),
  });

if (isLoading) return <AnalysisSkeleton />;
  if (error) return <div className="text-red-500 py-12 text-center">Failed to load results.</div>;

  const { paper, questions, analysisResult } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{paper.title}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {paper.subject} {paper.year && `· ${paper.year}`} · {paper.totalQuestions} questions
        </p>
        {data && (
  <ExportReport
    paper={paper}
    questions={questions}
    analysisResult={analysisResult}
    printButton={
      <button variant="outline" size="sm" onClick={() => window.print()} className="flex items-center gap-1.5">
        <Printer size={14} /> Print
      </button>
    }
  />
)}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Questions" value={paper.totalQuestions} />
        <SummaryCard label="Total Marks" value={paper.totalMarks} />
        <SummaryCard
          label="Syllabus Coverage"
          value={analysisResult ? `${analysisResult.syllabusCoveragePercent}%` : "—"}
        />
        <SummaryCard
          label="Out of Syllabus"
          value={analysisResult ? analysisResult.outOfSyllabusCount : "—"}
          highlight={analysisResult?.outOfSyllabusCount > 0}
        />
      </div>

      <div className="space-y-2">
  {/* AI category labels */}
  <div className="flex flex-wrap gap-2 text-xs">
    <span className="flex items-center gap-1 bg-slate-100 dark:bg-secondary text-muted-foreground px-2.5 py-1 rounded-full">
      <List size={10} /> Questions — raw extraction
    </span>
    <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 px-2.5 py-1 rounded-full">
      <BarChart2 size={10} /> Charts — LLM structured output
    </span>
    <span className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full">
      <Sparkles size={10} /> AI Insights — Generative AI
    </span>
    <span className="flex items-center gap-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 px-2.5 py-1 rounded-full">
      <Bot size={10} /> Agent — Agentic AI
    </span>
  </div>

  <Tabs defaultValue="questions">
    <TabsList className="dark:bg-secondary dark:neon-border">
      <TabsTrigger value="questions">
        <span className="flex items-center gap-1.5"><List size={13} /> Questions</span>
      </TabsTrigger>
      <TabsTrigger value="charts">
        <span className="flex items-center gap-1.5"><BarChart2 size={13} /> Charts</span>
      </TabsTrigger>
      <TabsTrigger value="topics">
        <span className="flex items-center gap-1.5"><BookOpen size={13} /> Topics</span>
      </TabsTrigger>
      <TabsTrigger value="genai">
        <span className="flex items-center gap-1.5"><Sparkles size={13} /> AI Insights</span>
      </TabsTrigger>
      <TabsTrigger value="agent">
        <span className="flex items-center gap-1.5"><Bot size={13} /> Agent</span>
      </TabsTrigger>
    </TabsList>

    <TabsContent value="questions" className="mt-4">
      <QuestionTable questions={questions} />
    </TabsContent>

    <TabsContent value="charts" className="mt-4">
      {/* LLM label */}
      <div className="mb-3 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-lg w-fit">
        <BarChart2 size={12} />
        LLM-Based — structured classification from fixed prompts
      </div>
      {analysisResult ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BloomsChart data={analysisResult.bloomsDistribution} />
          <DifficultyChart data={analysisResult.difficultyDistribution} />
          <ComplexityRadar data={analysisResult.complexityDistribution} />
        </div>
      ) : (
        <p className="text-slate-400 dark:text-slate-500 text-sm">
          Charts available after LLM analysis completes.
        </p>
      )}
    </TabsContent>

    <TabsContent value="topics" className="mt-4">
      <TopicsCoverage analysisResult={analysisResult} />
    </TabsContent>

    <TabsContent value="genai" className="mt-4">
      {/* GenAI label */}
      <div className="mb-4 flex items-center gap-2 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-lg w-fit">
        <Sparkles size={12} />
        Generative AI — open-ended, creative, novel output generated fresh each time
      </div>
      <GenAIPanel paperId={paperId} />
    </TabsContent>

    <TabsContent value="agent" className="mt-4">
      {/* Agent label */}
      <div className="mb-4 flex items-center gap-2 text-xs text-purple-600 bg-purple-50 dark:bg-purple-500/10 px-3 py-1.5 rounded-lg w-fit">
        <Bot size={12} />
        Agentic AI — model decides which tool to call, reasons across steps
      </div>
      <AgentChat paperId={paperId} />
    </TabsContent>
  </Tabs>
</div>
    </div>
  );
}
