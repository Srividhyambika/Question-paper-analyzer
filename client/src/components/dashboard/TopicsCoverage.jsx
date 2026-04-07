import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle, XCircle } from "lucide-react";

export default function TopicsCoverage({ analysisResult }) {
  if (!analysisResult) return null;

  const { topicsCovered, topicsNotCovered } = analysisResult;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
            <CheckCircle size={15} className="text-green-500" />
            Topics Covered ({topicsCovered?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topicsCovered?.length === 0 ? (
            <p className="text-slate-400 text-xs">None detected.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {topicsCovered?.map((topic, i) => (
                <span
                  key={i}
                  className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-0.5"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
            <XCircle size={15} className="text-red-400" />
            Topics Not Covered ({topicsNotCovered?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topicsNotCovered?.length === 0 ? (
            <p className="text-slate-400 text-xs">All syllabus topics are covered.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {topicsNotCovered?.map((topic, i) => (
                <span
                  key={i}
                  className="text-xs bg-red-50 text-red-600 border border-red-200 rounded-full px-2.5 py-0.5"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {analysisResult.insights && (
        <Card className="md:col-span-2 bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800 leading-relaxed">
              {analysisResult.insights}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
