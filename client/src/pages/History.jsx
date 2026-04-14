import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getUploadHistory, deletePaper } from "../services/api";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Trash2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const statusColor = {
  uploaded: "secondary",
  processing: "outline",
  completed: "default",
  failed: "destructive",
};

export default function History() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: () => getUploadHistory().then((r) => r.data),
  });

  const deleteMutation = useMutation({
  mutationFn: deletePaper,
  onSuccess: () => {
    queryClient.invalidateQueries(["history"]);
    toast.success("Paper deleted.");
  },
  onError: () => toast.error("Failed to delete paper."),
});


  if (isLoading) return (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <Loader2 size={28} className="animate-spin text-primary" />
    <p className="text-sm text-muted-foreground">Loading your papers...</p>
  </div>
);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Upload History</h1>

      {data?.length === 0 && (
        <p className="text-slate-400 dark:text-slate-500 text-sm ">No papers uploaded yet.</p>
      )}

      <div className="space-y-2">
        {data?.map((paper) => (
          <div
  key={paper._id}
  className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3 neon-card"
>
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-500 text-sm">{paper.title}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {paper.subject} {paper.year && `· ${paper.year}`} · {paper.totalQuestions} questions
                · {new Date(paper.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={statusColor[paper.status] || "outline"}>
                {paper.status}
              </Badge>
              {paper.status === "completed" && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/analysis/${paper._id}`)}
                >
                  <ExternalLink size={14} />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="text-red-400 hover:text-red-600"
                onClick={() => deleteMutation.mutate(paper._id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
