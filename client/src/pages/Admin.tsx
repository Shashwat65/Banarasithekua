import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  { key: "dashboard", label: "Dashboard", description: "Quick overview of store metrics and activity." },
  { key: "products", label: "Products", description: "Create, update, and manage your product catalog." },
  { key: "orders", label: "Orders", description: "Review and update order status across customers." },
  { key: "categories", label: "Categories", description: "Maintain category structure for product filtering." },
  { key: "combos", label: "Combos", description: "Curate bundle products and promotional sets." },
  { key: "team", label: "Team", description: "Manage team members shown on the website." },
  { key: "users", label: "Users", description: "Manage customer accounts and admin access." },
  { key: "sliders", label: "Slider", description: "Manage homepage slider images and ordering." },
];

const Admin = () => {
  const { section } = useParams();
  const active = section || "dashboard";
  const current = sections.find((s) => s.key === active) || sections[0];

  return (
    <div className="min-h-screen bg-muted/10 py-12">
      <div className="container mx-auto px-6 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-secondary/50">Admin Panel</p>
          <h1 className="text-3xl font-semibold text-secondary">{current.label}</h1>
          <p className="text-secondary/70 mt-2">{current.description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {sections.map((s) => (
            <Button key={s.key} asChild variant={active === s.key ? "default" : "outline"}>
              <Link to={`/admin/${s.key}`}>{s.label}</Link>
            </Button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{current.label}</CardTitle>
            <CardDescription>{current.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This section is ready to connect with admin workflows. Use the backend API endpoints to load, create, and manage records.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
