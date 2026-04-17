"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, Code2 } from "lucide-react";

interface Props {
  spaceId: string;
  slug: string;
}

export default function SpaceEmbedSection({ spaceId, slug }: Props) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://testiflow.com";

  const embedCode = `<div id="testiflow-wall" data-space="${spaceId}"></div>
<script src="${appUrl}/widget.js" async></script>`;

  async function handleCopy() {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast({ title: "Código copiado al portapapeles" });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="border-gray-100">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Code2 className="w-4 h-4 text-violet-600" />
          Embed en tu web
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Copia este código y pégalo en tu web para mostrar el Wall of Love.
        </p>
        <div className="relative">
          <pre className="bg-gray-950 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto leading-relaxed">
            {embedCode}
          </pre>
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Link directo al wall:{" "}
          <a
            href={`${appUrl}/wall/${slug}`}
            target="_blank"
            className="text-violet-600 hover:underline"
          >
            {appUrl}/wall/{slug}
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
