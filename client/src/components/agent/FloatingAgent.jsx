import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const suggestions = [
  "How does Bloom's Taxonomy work?",
  "What is cognitive complexity?",
  "How to prepare for hard questions?",
  "What does out-of-syllabus mean?",
];

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 px-3 py-2 bg-secondary rounded-2xl rounded-bl-none w-fit">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

export default function FloatingAgent() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "agent",
      content: "Hi! I'm your AI study assistant 👋 Ask me anything about exam preparation, analysis concepts, or how to use this app.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const send = async (message) => {
    if (!message.trim() || loading) return;

    const userMsg = { role: "user", content: message };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const history = updatedMessages.map((m) => ({
        role: m.role === "agent" ? "assistant" : "user",
        content: m.content,
      }));

      const response = await fetch("http://localhost:5001/api/agent/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message, conversationHistory: history }),
      });

      const data = await response.json();
      const agentMsg = { role: "agent", content: data.response };
      setMessages((prev) => [...prev, agentMsg]);

      if (!open) setUnread((n) => n + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className={`fixed bottom-20 right-6 z-50 w-80 bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300
          ${minimized ? "h-14" : "h-[460px]"}`}>

          {/* Header */}
          <div className="px-4 py-3 bg-primary flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">AI Study Assistant</p>
              {!minimized && (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                  <span className="text-xs text-white/70">Online</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setMinimized(!minimized)}
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              <X size={14} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Suggestions — only on first load */}
              {messages.length === 1 && (
                <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 border-b border-border flex-shrink-0">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs bg-secondary border border-border rounded-full px-2.5 py-1 text-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "agent" && (
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot size={12} className="text-primary" />
                      </div>
                    )}
                    <div
                      className={`text-xs px-3 py-2 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-relaxed
                        ${msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-secondary text-foreground rounded-bl-none"
                        }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot size={12} className="text-primary" />
                    </div>
                    <TypingIndicator />
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border p-2.5 flex gap-2 flex-shrink-0">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Ask anything..."
                  className="text-xs h-8"
                  disabled={loading}
                />
                <Button
                  size="sm"
                  className="h-8 w-8 p-0 flex-shrink-0"
                  onClick={() => send(input)}
                  disabled={loading || !input.trim()}
                >
                  <Send size={13} />
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating button */}
      <button
  onClick={() => setOpen(!open)}
  className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 neon-glow-btn"
>
        {open ? (
          <X size={20} className="text-white" />
        ) : (
          <Bot size={22} className="text-white" />
        )}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}
