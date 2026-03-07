import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getUploadHistory, deletePaper } from "../services/api";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Trash2, ExternalLink } from "lucide-react";

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
    onSuccess: () => queryClient.invalidateQueries(["history"]),
  });

  if (isLoading) return <div className="text-slate-500 py-12 text-center">Loading...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Upload History</h1>

      {data?.length === 0 && (
        <p className="text-slate-400 text-sm">No papers uploaded yet.</p>
      )}

      <div className="space-y-2">
        {data?.map((paper) => (
          <div
            key={paper._id}
            className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3"
          >
            <div>
              <p className="font-medium text-slate-800 text-sm">{paper.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">
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