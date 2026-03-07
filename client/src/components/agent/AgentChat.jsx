import { useState } from "react";
import { queryAgent } from "../../services/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send, Bot, User } from "lucide-react";

const suggestions = [
  "What's the overall difficulty of this paper?",
  "Which questions are out of syllabus?",
  "How many questions need deep analysis?",
  "Show high complexity questions",
];

export default function AgentChat({ paperId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (message) => {
    if (!message.trim()) return;
    const userMsg = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await queryAgent(message, paperId);
      setMessages((prev) => [...prev, { role: "agent", content: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "agent", content: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Suggestions */}
      {messages.length === 0 && (
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <p className="text-xs text-slate-500 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs bg-white border border-slate-200 rounded-full px-3 py-1 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="h-72 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "agent" && (
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={13} className="text-blue-600" />
              </div>
            )}
            <div className={`max-w-sm text-sm px-3 py-2 rounded-lg
              ${msg.role === "user"
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-slate-100 text-slate-700 rounded-bl-none"
              }`}>
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={13} className="text-slate-600" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot size={13} className="text-blue-600" />
            </div>
            <div className="bg-slate-100 text-slate-400 text-sm px-3 py-2 rounded-lg rounded-bl-none">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask about this paper..."
          className="text-sm"
        />
        <Button size="sm" onClick={() => send(input)} disabled={loading || !input.trim()}>
          <Send size={14} />
        </Button>
      </div>
    </div>
  );
}