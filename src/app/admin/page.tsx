
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Newspaper, LayoutDashboard, ShoppingBag, MessageSquare, ImageIcon } from "lucide-react";

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
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  Product Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create, view, and manage all your products.
                </p>
                <Button asChild>
                  <Link href="/admin/products">Go to Products</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Contact Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View and manage inquiries submitted through the contact form.
                </p>
                <Button asChild>
                  <Link href="/admin/messages">View Messages</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Homepage Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage settings for your homepage, like the hero image.
                </p>
                <Button asChild>
                  <Link href="/admin/homepage">Go to Homepage Settings</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Sub-Meter Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Review and approve sub-meter application forms.
                </p>
                <Button asChild>
                  <Link href="/admin/submeter-requests">Manage Applications</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
