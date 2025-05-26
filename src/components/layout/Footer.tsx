export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Tari Smart Power. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          {/* Placeholder for social media icons or other links */}
          {/* <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link> */}
        </div>
      </div>
    </footer>
  );
}
