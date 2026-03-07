import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="text-center py-24 space-y-4">
      <h1 className="text-4xl font-bold text-slate-300">404</h1>
      <p className="text-slate-500">Page not found.</p>
      <Button asChild variant="outline">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
}