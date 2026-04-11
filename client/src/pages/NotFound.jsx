import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Brain } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Brain size={28} className="text-primary" />
      </div>
      <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
      <h2 className="text-xl font-semibold text-foreground dark:text-white mb-2">
        Page not found
      </h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-xs">
        Looks like this page went out of syllabus. Let's get you back on track.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/history">My Papers</Link>
        </Button>
      </div>
    </div>
  );
}
