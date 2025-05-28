
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Newspaper, LayoutDashboard } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
          </div>
          <CardDescription>Welcome! Manage your Tari Electra website content from here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            This is the central hub for managing various aspects of your website. 
            Use the navigation above or the quick links below to get started.
          </p>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Newspaper className="h-5 w-5 text-primary" />
                  Blog Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create, view, and manage all your blog posts and articles.
                </p>
                <Button asChild>
                  <Link href="/admin/blog">Go to Blog Posts</Link>
                </Button>
              </CardContent>
            </Card>
            {/* Example of another potential admin card */}
            {/* 
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="h-5 w-5 text-primary" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View and manage user accounts and roles (feature to be implemented).
                </p>
                <Button disabled>Go to Users (Coming Soon)</Button>
              </CardContent>
            </Card>
            */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
