import AdminHeader from "@/components/admin-header";
import { Home } from "lucide-react";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-screen p-4">
          <div className="flex items-center gap-2 mb-8">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <nav className="space-y-2">
            <Link
              href="/admin"
              className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/blogs"
              className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Manage Blogs
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <AdminHeader />
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
