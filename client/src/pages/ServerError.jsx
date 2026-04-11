import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ServerError() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
        <AlertTriangle size={28} className="text-destructive" />
      </div>
      <h1 className="text-6xl font-bold text-destructive mb-2">500</h1>
      <h2 className="text-xl font-semibold text-foreground dark:text-white mb-2">
        Something went wrong
      </h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-xs">
        The server encountered an error. Please try again in a moment.
      </p>
      <Button asChild>
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
}
