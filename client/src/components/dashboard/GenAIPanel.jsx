import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  getTopicSummary, getPredictedQuestions,
  getMnemonics, getStudySchedule
} from "../../services/api";
import {
  BookOpen, Sparkles, Brain, Calendar,
  Loader2, ChevronDown, ChevronUp, Zap
} from "lucide-react";

function GenAICard({ icon: Icon, title, description, color, children, badge }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={`dark:neon-card border-2 ${color}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-semibold text-foreground dark:text-white">
                  {title}
                </CardTitle>
                {badge && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Sparkles size={9} /> GenAI
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
          </div>
          {expanded && (
            <button onClick={() => setExpanded(false)} className="text-muted-foreground hover:text-foreground">
              <ChevronUp size={16} />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children({ expanded, setExpanded })}
      </CardContent>
    </Card>
  );
}

function LoadingState({ text }) {
  return (
    <div className="flex items-center gap-2 py-4 text-muted-foreground">
      <Loader2 size={16} className="animate-spin text-primary" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

function ResultText({ text }) {
  return (
    <div className="mt-3 text-sm text-foreground dark:text-slate-200 leading-relaxed whitespace-pre-wrap bg-secondary/30 rounded-lg p-4 border border-border">
      {text}
    </div>
  );
}

export default function GenAIPanel({ paperId }) {
  // Topic Summary
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Predicted Questions
  const [predictions, setPredictions] = useState(null);
  const [predictionsLoading, setPredictionsLoading] = useState(false);

  // Mnemonics
  const [mnemonics, setMnemonics] = useState(null);
  const [mnemonicsLoading, setMnemonicsLoading] = useState(false);

  // Study Schedule
  const [schedule, setSchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(3);

  const handleTopicSummary = async (setExpanded) => {
    setSummaryLoading(true);
    try {
      const { data } = await getTopicSummary(paperId);
      setSummary(data.summary);
      setExpanded(true);
    } catch { setSummary("Failed to generate. Please try again."); }
    finally { setSummaryLoading(false); }
  };

  const handlePredictions = async (setExpanded) => {
    setPredictionsLoading(true);
    try {
      const { data } = await getPredictedQuestions(paperId);
      setPredictions(data.predictions);
      setExpanded(true);
    } catch { setPredictions("Failed to generate. Please try again."); }
    finally { setPredictionsLoading(false); }
  };

  const handleMnemonics = async (setExpanded) => {
    setMnemonicsLoading(true);
    try {
      const { data } = await getMnemonics(paperId);
      setMnemonics(data.mnemonics);
      setExpanded(true);
    } catch { setMnemonics("Failed to generate. Please try again."); }
    finally { setMnemonicsLoading(false); }
  };

  const handleSchedule = async (setExpanded) => {
    if (!examDate) return;
    setScheduleLoading(true);
    try {
      const { data } = await getStudySchedule(paperId, examDate, hoursPerDay);
      setSchedule(data.schedule);
      setExpanded(true);
    } catch { setSchedule("Failed to generate. Please try again."); }
    finally { setScheduleLoading(false); }
  };

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2 pb-1 border-b border-border">
        <Sparkles size={16} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground dark:text-white">
          Generative AI Features
        </h3>
        <span className="text-xs text-muted-foreground">
          — open-ended content generated fresh each time
        </span>
      </div>

      {/* 1. Topic Summary */}
      <GenAICard
        icon={BookOpen}
        title="Topic-wise Summary"
        description="What each topic in this paper actually tests and how to approach it"
        color="border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 text-blue-600"
        badge
      >
        {({ expanded, setExpanded }) => (
          <>
            {!summary && !summaryLoading && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleTopicSummary(setExpanded)}
                className="gap-1.5"
              >
                <Sparkles size={13} /> Generate Summary
              </Button>
            )}
            {summaryLoading && <LoadingState text="Analyzing topics..." />}
            {summary && expanded && <ResultText text={summary} />}
            {summary && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                <ChevronDown size={12} /> Show summary
              </button>
            )}
          </>
        )}
      </GenAICard>

      {/* 2. Predicted Questions */}
      <GenAICard
        icon={Zap}
        title="Predicted Next Exam Questions"
        description="AI-predicted questions likely to appear based on this paper's patterns and gaps"
        color="border-purple-200 dark:border-purple-500/20 bg-purple-50/50 dark:bg-purple-500/5 text-purple-600"
        badge
      >
        {({ expanded, setExpanded }) => (
          <>
            {!predictions && !predictionsLoading && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Based on topic gaps and difficulty patterns from this paper.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePredictions(setExpanded)}
                  className="gap-1.5"
                >
                  <Sparkles size={13} /> Predict Questions
                </Button>
              </div>
            )}
            {predictionsLoading && <LoadingState text="Predicting questions..." />}
            {predictions && expanded && <ResultText text={predictions} />}
            {predictions && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                <ChevronDown size={12} /> Show predictions
              </button>
            )}
          </>
        )}
      </GenAICard>

      {/* 3. Mnemonics */}
      <GenAICard
        icon={Brain}
        title="Memory Tricks for Hard Questions"
        description="Custom mnemonics and mental models for the most complex questions"
        color="border-orange-200 dark:border-orange-500/20 bg-orange-50/50 dark:bg-orange-500/5 text-orange-600"
        badge
      >
        {({ expanded, setExpanded }) => (
          <>
            {!mnemonics && !mnemonicsLoading && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMnemonics(setExpanded)}
                className="gap-1.5"
              >
                <Sparkles size={13} /> Generate Memory Tricks
              </Button>
            )}
            {mnemonicsLoading && <LoadingState text="Creating memory tricks..." />}
            {mnemonics && expanded && <ResultText text={mnemonics} />}
            {mnemonics && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                <ChevronDown size={12} /> Show memory tricks
              </button>
            )}
          </>
        )}
      </GenAICard>

      {/* 4. Study Schedule */}
      <GenAICard
        icon={Calendar}
        title="Personalised Study Schedule"
        description="Day-by-day study plan based on your exam date and paper complexity"
        color="border-green-200 dark:border-green-500/20 bg-green-50/50 dark:bg-green-500/5 text-green-600"
        badge
      >
        {({ expanded, setExpanded }) => (
          <>
            {!schedule && !scheduleLoading && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground dark:text-slate-200">
                      Exam Date
                    </label>
                    <Input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="h-8 text-xs dark:neon-input"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground dark:text-slate-200">
                      Hours per Day
                    </label>
                    <Input
                      type="number"
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(parseInt(e.target.value) || 3)}
                      min={1}
                      max={12}
                      className="h-8 text-xs dark:neon-input"
                    />
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSchedule(setExpanded)}
                  disabled={!examDate}
                  className="gap-1.5"
                >
                  <Sparkles size={13} /> Generate Schedule
                </Button>
              </div>
            )}
            {scheduleLoading && <LoadingState text="Building your study schedule..." />}
            {schedule && expanded && <ResultText text={schedule} />}
            {schedule && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                <ChevronDown size={12} /> Show schedule
              </button>
            )}
          </>
        )}
      </GenAICard>
    </div>
  );
}
