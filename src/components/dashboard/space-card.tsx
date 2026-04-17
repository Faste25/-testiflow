"use client";

import Link from "next/link";
import { Space } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Settings, MessageSquare } from "lucide-react";

interface SpaceCardProps {
  space: Space & { testimonials: { count: number }[] };
}

export default function SpaceCard({ space }: SpaceCardProps) {
  const count = space.testimonials?.[0]?.count ?? 0;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return (
    <Card className="hover:shadow-md transition-shadow border-gray-100">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{space.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              /wall/{space.slug}
            </p>
          </div>
          <Badge
            variant={space.is_active ? "default" : "secondary"}
            className={
              space.is_active
                ? "bg-green-100 text-green-700 hover:bg-green-100"
                : ""
            }
          >
            {space.is_active ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {space.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {space.description}
          </p>
        )}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{count} testimonio{count !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/wall/${space.slug}`}
            target="_blank"
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Ver Wall
            </Button>
          </Link>
          <Link href={`/dashboard/spaces/${space.id}`}>
            <Button variant="outline" size="sm">
              <Settings className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
