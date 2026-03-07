import { Progress } from "../ui/progress";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function UploadProgress({ status, progress, error }) {
  return (
    <div className="border border-slate-200 rounded-lg px-4 py-3 space-y-2">
      <div className="flex items-center gap-2 text-sm">
        {status === "uploading" && <Loader2 size={15} className="animate-spin text-blue-500" />}
        {status === "processing" && <Loader2 size={15} className="animate-spin text-amber-500" />}
        {status === "done" && <CheckCircle size={15} className="text-green-500" />}
        {status === "error" && <XCircle size={15} className="text-red-500" />}
        <span className="text-slate-600">
          {status === "uploading" && "Uploading files..."}
          {status === "processing" && "Extracting text from PDFs..."}
          {status === "done" && "Done! Redirecting..."}
          {status === "error" && (error || "Upload failed.")}
        </span>
      </div>
      {status === "uploading" && (
        <Progress value={progress} className="h-1.5" />
      )}
    </div>
  );
}