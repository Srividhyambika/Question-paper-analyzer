import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Brain, BookOpen, TrendingUp, Zap, ChevronRight,
  BarChart2, Upload, Cpu, FileText, ChevronDown, ChevronUp
} from "lucide-react";

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const isDecimal = target.toString().includes(".");
          const numericTarget = parseFloat(target);

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * numericTarget;
            setCount(isDecimal ? current.toFixed(1) : Math.floor(current));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(target);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-card hover:bg-secondary/50 transition-colors"
      >
        <span className="font-medium text-foreground text-sm">{question}</span>
        {open
          ? <ChevronUp size={16} className="text-muted-foreground flex-shrink-0" />
          : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 py-4 bg-secondary/20 border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  { icon: Brain, title: "AI-Powered Analysis", desc: "Every question analyzed for difficulty, Bloom's level, and cognitive complexity.", color: "bg-primary/10 text-primary" },
  { icon: BookOpen, title: "Syllabus Matching", desc: "Instantly detect out-of-syllabus questions with confidence scoring.", color: "bg-warning/10 text-warning" },
  { icon: BarChart2, title: "Visual Insights", desc: "Charts and breakdowns that make paper patterns obvious at a glance.", color: "bg-success/10 text-success" },
  { icon: Zap, title: "Smart Agent", desc: "Ask anything about your paper in natural language and get instant answers.", color: "bg-coral/10 text-coral" },
];

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your PDFs",
    desc: "Upload your question paper, syllabus, and textbooks. All three are required for accurate analysis.",
    color: "bg-primary/10 text-primary",
    detail: "Supports any university exam format — Q.01, Q1a, Question 1, and more.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analyzes Everything",
    desc: "Our Groq-powered LLM processes each question individually — matching topics, rating difficulty, and classifying cognitive complexity.",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    detail: "Uses Llama 3.3 70B with structured prompting for consistent, accurate output.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Get Actionable Insights",
    desc: "View a full breakdown of every question with charts, topic coverage, and an AI agent you can query in plain English.",
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    detail: "Export as PDF or ask the agent: 'Generate a study plan for this paper.'",
  },
];

const stats = [
  { value: 42, suffix: "+", label: "Questions per paper" },
  { value: 6, suffix: "", label: "Bloom's levels detected" },
  { value: 100, suffix: "%", label: "Syllabus coverage tracked" },
  { value: 7, suffix: "", label: "Agent tools available" },
];

const faqs = [
  {
    question: "What file formats are supported?",
    answer: "Currently PDF only. The system handles both digital PDFs (with selectable text) and structured PDFs from university portals. Scanned/image-only PDFs are not fully supported yet — OCR support is planned for a future update.",
  },
  {
    question: "How accurate is the syllabus matching?",
    answer: "Accuracy depends on the quality of the syllabus PDF. If your syllabus has clear unit headings and bullet-point topics, matching confidence is typically 80-95%. For unstructured syllabi, the LLM uses the question content itself to infer topics.",
  },
  {
    question: "How long does analysis take?",
    answer: "A typical 10-question paper takes 2-3 minutes to fully analyze. Larger papers with 30+ questions may take up to 8 minutes. The system processes questions sequentially to respect API rate limits.",
  },
  {
    question: "Is my data private?",
    answer: "Yes. Your uploaded PDFs are stored temporarily on the server for processing and are not shared with third parties. Passwords are hashed with bcrypt and never stored in plaintext.",
  },
  {
    question: "Can I analyze multiple papers and compare them?",
    answer: "Yes. Upload multiple papers and use the Compare page to view side-by-side statistics. The AI agent also supports year-over-year comparison queries like 'Compare this paper with the 2022 paper.'",
  },
  {
    question: "What is Bloom's Taxonomy and why does it matter?",
    answer: "Bloom's Taxonomy is a framework that classifies questions by cognitive level — from basic recall (L1: Remember) to complex creation (L6: Create). Knowing the level of each question helps you prepare the right type of answer and allocate study time effectively.",
  },
];

// ─── Floating Sample Cards ────────────────────────────────────────────────────
const sampleQuestions = [
  { q: "Define oxidation and reduction with examples.", difficulty: "medium", blooms: "L2 · Understand", complexity: 4, inSyllabus: true },
  { q: "Explain the Banker's algorithm with a snapshot.", difficulty: "hard", blooms: "L4 · Analyze", complexity: 8, inSyllabus: true },
  { q: "Calculate average waiting time using FCFS.", difficulty: "medium", blooms: "L3 · Apply", complexity: 6, inSyllabus: true },
  { q: "Design a deadlock-free resource allocation graph.", difficulty: "hard", blooms: "L6 · Create", complexity: 9, inSyllabus: false },
];

const diffColor = { easy: "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400", medium: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400", hard: "text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400" };

function FloatingCard({ q, index }) {
  const delays = ["delay-0", "delay-150", "delay-300", "delay-500"];
  return (
    <div
      className={`bg-card border border-border rounded-xl p-4 shadow-md animate-on-scroll card-hover`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-primary">Q{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground line-clamp-2 mb-2">{q.q}</p>
          <div className="flex flex-wrap gap-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColor[q.difficulty]}`}>
              {q.difficulty}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              {q.blooms}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${q.inSyllabus ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
              {q.inSyllabus ? "✓ In syllabus" : "⚠ Out of syllabus"}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Complexity</span>
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${q.complexity >= 7 ? "bg-red-400" : q.complexity >= 4 ? "bg-yellow-400" : "bg-green-400"}`}
                style={{ width: `${q.complexity * 10}%` }}
              />
            </div>
            <span className="text-xs font-medium text-foreground">{q.complexity}/10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Landing() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      el.classList.add("opacity-0", "translate-y-8", "transition-all", "duration-700");
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background dark:bg-[hsl(230_25%_6%)]">

      {/* ── Navbar ── */}
      <nav className="border-b border-border bg-card/80 dark:bg-[hsl(230_22%_9%/0.8)] backdrop-blur-sm sticky top-0 z-50 neon-navbar">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Brain size={14} className="text-white" />
            </div>
            <span className="font-semibold text-foreground dark:text-white">Exam PYQ Analyzer</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="dark:text-slate-300">
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" asChild className="dark:neon-glow-btn">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-6 animate-on-scroll">
          <Zap size={12} />
          AI-Powered · MERN Stack · Groq LLM
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white mb-4 animate-on-scroll leading-tight">
          Turn PYQs into your
          <span className="text-primary"> exam strategy</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8 animate-on-scroll">
          Upload your question paper, syllabus, and textbooks. Get instant AI analysis
          of every question — difficulty, Bloom's level, syllabus coverage, and more.
        </p>
        <div className="flex items-center justify-center gap-3 animate-on-scroll">
          <Button size="lg" asChild className="gap-2 dark:neon-glow-btn">
            <Link to="/register">Start Analyzing <ChevronRight size={16} /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="dark:border-primary/30 dark:text-slate-300">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>

        {/* Hero preview */}
        <div className="mt-14 animate-on-scroll">
          <div className="bg-card dark:bg-[hsl(230_22%_9%)] border border-border dark:neon-card rounded-2xl shadow-xl p-6 max-w-2xl mx-auto text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-xs text-muted-foreground ml-2">Analysis Dashboard</span>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: "Questions", value: "10", color: "text-primary" },
                { label: "Coverage", value: "100%", color: "text-green-500" },
                { label: "Difficulty", value: "6/10", color: "text-yellow-500" },
                { label: "Out of Syllabus", value: "0", color: "text-red-400" },
              ].map((s) => (
                <div key={s.label} className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-lg font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            {["Q1 · Define oxidation and reduction", "Q2 · Explain corrosion of iron"].map((q, i) => (
              <div key={i} className="border border-border rounded-lg px-3 py-2.5 mb-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">Q{i + 1}</span>
                </div>
                <p className="text-sm text-foreground dark:text-slate-200 flex-1 truncate">{q}</p>
                <span className="text-xs bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full flex-shrink-0">Medium</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Animated Stats ── */}
      <section className="bg-primary dark:bg-primary/80 py-14">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label} className="animate-on-scroll">
              <p className="text-3xl font-bold text-white">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-primary-foreground/70 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground dark:text-white mb-2 animate-on-scroll">
            How it works
          </h2>
          <p className="text-muted-foreground animate-on-scroll">
            From upload to insight in three simple steps.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ icon: Icon, step, title, desc, color, detail }, i) => (
              <div key={step} className="animate-on-scroll relative">
                <div className="flex flex-col items-center text-center">
                  {/* Step circle */}
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center shadow-md`}>
                      <Icon size={28} />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground dark:text-white mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{desc}</p>
                  <p className="text-xs text-primary/70 dark:text-primary/90 bg-primary/5 rounded-lg px-3 py-2 border border-primary/10">
                    {detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Analysis Cards ── */}
      <section className="bg-secondary/30 dark:bg-[hsl(230_22%_8%)] py-16 border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-2 animate-on-scroll">
              See what the analysis looks like
            </h2>
            <p className="text-muted-foreground animate-on-scroll">
              Every question gets a full breakdown — here's a sample from a real paper.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {sampleQuestions.map((q, i) => (
              <FloatingCard key={i} q={q} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-foreground dark:text-white text-center mb-2 animate-on-scroll">
          Everything you need to decode any exam
        </h2>
        <p className="text-muted-foreground text-center mb-10 animate-on-scroll">
          Built for students who want to study smarter, not harder.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="animate-on-scroll bg-card dark:bg-[hsl(230_22%_9%)] border border-border rounded-xl p-5 card-hover neon-card">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon size={18} />
              </div>
              <h3 className="font-semibold text-foreground dark:text-white mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-secondary/30 dark:bg-[hsl(230_22%_8%)] border-y border-border py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-2 animate-on-scroll">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground animate-on-scroll">
              Everything you need to know before getting started.
            </p>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="animate-on-scroll">
                <FAQItem question={faq.question} answer={faq.answer} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="animate-on-scroll">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Brain size={28} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground dark:text-white mb-3">
              Ready to analyze your first paper?
            </h2>
            <p className="text-muted-foreground mb-8">
              Free to use. No credit card required. Results in minutes.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button size="lg" asChild className="gap-2 dark:neon-glow-btn">
                <Link to="/register">
                  Get Started Free <ChevronRight size={16} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="dark:border-primary/30 dark:text-slate-300">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
<footer className="border-t border-border py-8">
  <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
    
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
        <Brain size={12} className="text-white" />
      </div>
      <span className="text-sm font-medium text-foreground dark:text-white">
        Exam PYQ Analyzer
      </span>
    </div>

    <p className="text-xs text-muted-foreground text-center">
      Built with MERN Stack + Groq AI · Mini Project · 2025–26
    </p>

    <div className="flex items-center gap-4">
      <a
        href="https://github.com/Srividhyambika/Question-paper-analyzer"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        GitHub →
      </a>

      <Link
        to="/login"
        className="text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        Login
      </Link>

      <Link
        to="/register"
        className="text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        Register
      </Link>
    </div>

  </div>
</footer>

    </div>
  );
}
