import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-semibold text-secondary">Page not found</h1>
      <p className="text-muted-foreground mt-2">The page you are looking for doesn&apos;t exist.</p>
      <Button asChild className="mt-6">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
