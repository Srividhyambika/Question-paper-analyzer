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

      <Tabs defaultValue="questions">
        <TabsList className="dark:bg-secondary dark:border dark:neon-border">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="agent">Ask Agent</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-4">
          <QuestionTable questions={questions} />
        </TabsContent>

        <TabsContent value="charts" className="mt-4">
          {analysisResult ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BloomsChart data={analysisResult.bloomsDistribution} />
              <DifficultyChart data={analysisResult.difficultyDistribution} />
              <ComplexityRadar data={analysisResult?.complexityDistribution} />
            </div>
          ) : (
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              Charts available after LLM analysis (Phase 2).
            </p>
          )}
        </TabsContent>

        <TabsContent value="topics" className="mt-4">
          <TopicsCoverage analysisResult={analysisResult} />
        </TabsContent>


        <TabsContent value="agent" className="mt-4">
          <AgentChat paperId={paperId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
