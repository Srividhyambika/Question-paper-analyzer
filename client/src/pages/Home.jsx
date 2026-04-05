import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadPDFs, runAnalysis, getAnalysisStatus } from "../services/api";
import UploadZone from "../components/upload/UploadZone";
import UploadProgress from "../components/upload/UploadProgress";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import toast from "react-hot-toast";

export default function Home() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({
    questionPaper: null,
    syllabus: null,
    textbooks: [],
  });
  const [meta, setMeta] = useState({ title: "", year: "", subject: "" });
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | uploading | processing | done | error
  const [error, setError] = useState("");

  const allFilesReady =
    files.questionPaper && files.syllabus && files.textbooks.length > 0;

  const handleSubmit = async () => {
  if (!allFilesReady) return;
  setStatus("uploading");
  setError("");

  try {
    const formData = new FormData();
    formData.append("questionPaper", files.questionPaper);
    formData.append("syllabus", files.syllabus);
    files.textbooks.forEach((f) => formData.append("textbooks", f));
    if (meta.title) formData.append("title", meta.title);
    if (meta.year) formData.append("year", meta.year);
    if (meta.subject) formData.append("subject", meta.subject);

    const { data } = await uploadPDFs(formData, setProgress);
    setStatus("processing");

    await runAnalysis(data.paperId);

    // Poll status until completed instead of navigating immediately
    const pollStatus = async (paperId) => {
      const { data: statusData } = await getAnalysisStatus(paperId);
      if (statusData.status === "completed") {
        toast.success("Analysis complete!");
        navigate(`/analysis/${paperId}`);
      } else if (statusData.status === "failed") {
        setStatus("error");
        setError("Analysis failed. Please try again.");
      } else {
        setTimeout(() => pollStatus(paperId), 3000);
      }
    };

    pollStatus(data.paperId);

  } catch (err) {
    toast.error(err.response?.data?.message || "Upload failed.");
  }
};

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Upload Exam Paper</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Upload your question paper, syllabus, and textbooks to begin analysis.
        </p>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-slate-800 dark:text-white">Paper Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-3">
          <Input
            placeholder="Title (optional)"
            value={meta.title}
            onChange={(e) => setMeta({ ...meta, title: e.target.value })}
          />
          <Input
            placeholder="Year (e.g. 2023)"
            type="number"
            value={meta.year}
            onChange={(e) => setMeta({ ...meta, year: e.target.value })}
          />
          <Input
            placeholder="Subject (optional)"
            value={meta.subject}
            onChange={(e) => setMeta({ ...meta, subject: e.target.value })}
          />
        </CardContent>
      </Card>

      {/* Upload zones */}
      <div className="space-y-3">
        <UploadZone
          label="Question Paper"
          required
          accept=".pdf"
          multiple={false}
          file={files.questionPaper}
          onChange={(f) => setFiles({ ...files, questionPaper: f })}
        />
        <UploadZone
          label="Syllabus"
          required
          accept=".pdf"
          multiple={false}
          file={files.syllabus}
          onChange={(f) => setFiles({ ...files, syllabus: f })}
        />
        <UploadZone
          label="Textbook(s)"
          required
          accept=".pdf"
          multiple={true}
          file={files.textbooks}
          onChange={(f) => setFiles({ ...files, textbooks: f })}
        />
      </div>

      {/* Progress */}
      {status !== "idle" && (
        <UploadProgress status={status} progress={progress} error={error} />
      )}

      <Button
        className="w-full"
        disabled={!allFilesReady || status === "uploading" || status === "processing"}
        onClick={handleSubmit}
      >
        {status === "uploading"
          ? `Uploading... ${progress}%`
          : status === "processing"
          ? "Processing PDFs..."
          : "Analyze Paper"}
      </Button>
    </div>
  );
}
