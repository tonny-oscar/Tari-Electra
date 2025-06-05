// components/admin/BlogActionsCell.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

export function BlogActionsCell({ slug, title }: { slug: string; title: string }) {
  return (
    <div className="flex gap-2">
      <Button size="icon" variant="outline" aria-label={`Edit ${title}`}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="destructive" aria-label={`Delete ${title}`}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
