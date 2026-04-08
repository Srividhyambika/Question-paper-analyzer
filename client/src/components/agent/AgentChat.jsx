import { useState, useRef, useEffect } from "react";
import { queryAgent } from "../../services/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send, Bot, User, Zap } from "lucide-react";

const suggestions = [
  "What's the overall difficulty of this paper?",
  "Which topics are not covered in this paper?",
  "Show me the Bloom's taxonomy breakdown",
  "Are there any out-of-syllabus questions?",
  "Generate a study plan for this paper",
  "Which questions need the deepest analysis?",
];

const toolLabels = {
  get_questions_by_difficulty: "Filtering questions",
  get_syllabus_gaps: "Checking syllabus gaps",
  get_blooms_breakdown: "Analyzing Bloom's levels",
  get_out_of_syllabus: "Finding out-of-syllabus questions",
  get_paper_summary: "Fetching paper summary",
  generate_study_plan: "Generating study plan",
  compare_papers: "Comparing papers",
};

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot size={13} className="text-primary" />
        </div>
      )}
      <div className="max-w-sm space-y-1">
        {msg.toolUsed && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap size={10} className="text-warning" />
            {toolLabels[msg.toolUsed] || msg.toolUsed}
          </div>
        )}
        <div className={`text-sm px-3 py-2 rounded-2xl whitespace-pre-wrap
          ${isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-secondary text-foreground rounded-bl-none"
          }`}>
          {msg.content}
        </div>
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
          <User size={13} className="text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export default function AgentChat({ paperId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (message) => {
    if (!message.trim() || loading) return;

    const userMsg = { role: "user", content: message };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = updatedMessages.map((m) => ({
        role: m.role === "agent" ? "assistant" : "user",
        content: m.content,
      }));

      const { data } = await queryAgent(message, paperId, conversationHistory);

      setMessages((prev) => [
        ...prev,
        { role: "agent", content: data.response, toolUsed: data.toolUsed },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "Something went wrong. Please try again.", toolUsed: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card neon-card">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot size={14} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Paper Analysis Agent</p>
          <p className="text-xs text-muted-foreground">Ask anything about this paper</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-muted-foreground">Active</span>
        </div>
      </div>

      {/* Suggestions */}
      {messages.length === 0 && (
        <div className="p-4 border-b border-border">
          <p className="text-xs text-muted-foreground mb-2.5">Suggested questions:</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs bg-secondary border border-border rounded-full px-3 py-1 text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot size={13} className="text-primary" />
            </div>
            <div className="bg-secondary text-muted-foreground text-sm px-3 py-2 rounded-2xl rounded-bl-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask about this paper..."
          className="text-sm"
          disabled={loading}
        />
        <Button
          size="sm"
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="flex-shrink-0"
        >
          <Send size={14} />
        </Button>
      </div>
    </div>
  );
}
