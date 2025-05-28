
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Newspaper } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Admin Dashboard</CardTitle>
          <CardDescription>Manage your website content from here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This is the central hub for managing Tari Electra's website.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-primary" />
                  Blog Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Create, view, and manage your blog posts.
                </p>
                <Button asChild>
                  <Link href="/admin/blog">Go to Blog Management</Link>
                </Button>
              </CardContent>
            </Card>
            {/* Add more cards here for other admin sections in the future */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
