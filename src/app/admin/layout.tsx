import { Home } from "lucide-react";
import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-screen">
          <div className="p-6 ">
            <div
              className="flex gap-5
            "
            >
              <h1 className="text-xl font-bold text-foreground mb-8 flex-row">
                Admin Panel
              </h1>
              {/* <a
                href="/"
                className="text-sm font-bold text-foreground mb-8 flex-row"
              >
                Home
              </a> */}
              <a href="/">
                <Home className="w-6 h-6 text-blue-600" />
              </a>
            </div>

            <nav className="space-y-2">
              <a
                href="/admin"
                className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/admin/blogs"
                className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                Manage Blogs
              </a>
              <a
                href="/admin/projects"
                className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                Manage Projects
              </a>
              <a
                href="/admin/proof-of-work"
                className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                Proof of Work
              </a>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
