"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Testimonial, TestimonialStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Play, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type TestimonialWithSpace = Testimonial & { spaces: { name: string } };

const FILTERS: { label: string; value: TestimonialStatus | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Pendientes", value: "pending" },
  { label: "Aprobados", value: "approved" },
  { label: "Rechazados", value: "rejected" },
];

const STATUS_BADGE: Record<TestimonialStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<TestimonialStatus, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
};

interface Props {
  initialTestimonials: TestimonialWithSpace[];
}

export default function TestimonialsList({ initialTestimonials }: Props) {
  const [testimonials, setTestimonials] =
    useState<TestimonialWithSpace[]>(initialTestimonials);
  const [filter, setFilter] = useState<TestimonialStatus | "all">("all");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = createClient();
  const router = useRouter();

  const filtered =
    filter === "all"
      ? testimonials
      : testimonials.filter((t) => t.status === filter);

  async function updateStatus(id: string, status: TestimonialStatus) {
    const { error } = await supabase
      .from("testimonials")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    toast({
      title: status === "approved" ? "Testimonio aprobado ✓" : "Testimonio rechazado",
    });
    router.refresh();
  }

  if (!testimonials.length) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
        <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-muted-foreground">Aún no tienes testimonios</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              filter === f.value
                ? "bg-violet-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300"
            )}
          >
            {f.label}
            <span className="ml-1.5 text-xs opacity-70">
              {f.value === "all"
                ? testimonials.length
                : testimonials.filter((t) => t.status === f.value).length}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-semibold text-violet-700">
                    {t.submitter_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium text-sm text-gray-900">
                      {t.submitter_name}
                    </span>
                    {t.submitter_email && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {t.submitter_email}
                      </span>
                    )}
                  </div>
                  <Badge className={cn("text-xs ml-auto", STATUS_BADGE[t.status])}>
                    {STATUS_LABEL[t.status]}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mb-2">
                  {t.spaces.name} ·{" "}
                  {new Date(t.created_at).toLocaleDateString("es")}
                  {t.rating && (
                    <span className="ml-2">{"⭐".repeat(t.rating)}</span>
                  )}
                </p>

                {t.text_content && (
                  <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                    "{t.text_content}"
                  </p>
                )}

                {t.video_url && (
                  <div className="mt-2">
                    {playingId === t.id ? (
                      <video
                        src={t.video_url}
                        controls
                        autoPlay
                        className="w-full max-w-xs rounded-lg"
                        onEnded={() => setPlayingId(null)}
                      />
                    ) : (
                      <button
                        onClick={() => setPlayingId(t.id)}
                        className="flex items-center gap-2 text-xs text-violet-600 hover:text-violet-800 font-medium"
                      >
                        <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 ml-0.5" />
                        </div>
                        Ver video
                      </button>
                    )}
                  </div>
                )}
              </div>

              {t.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => updateStatus(t.id, "approved")}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => updateStatus(t.id, "rejected")}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
