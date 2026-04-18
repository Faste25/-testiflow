"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Space } from "@/types";

interface SpaceFormProps {
  userId: string;
  space?: Space;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50);
}

export default function SpaceForm({ userId, space }: SpaceFormProps) {
  const [name, setName] = useState(space?.name ?? "");
  const [slug, setSlug] = useState(space?.slug ?? "");
  const [description, setDescription] = useState(space?.description ?? "");
  const [thankYou, setThankYou] = useState(
    space?.thank_you_message ?? "¡Gracias por tu testimonio!"
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  function handleNameChange(value: string) {
    setName(value);
    if (!space) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = { name, slug, description, thank_you_message: thankYou, user_id: userId };

    const { error } = space
      ? await supabase.from("spaces").update(payload).eq("id", space.id)
      : await supabase.from("spaces").insert(payload);

    if (error) {
      toast({
        title: "Error",
        description: error.message.includes("duplicate")
          ? "Ese slug ya está en uso. Elige otro."
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: space ? "Espacio actualizado" : "Espacio creado ✨" });
      router.push("/dashboard");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <Card className="border-gray-100">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del espacio *</Label>
            <Input
              id="name"
              placeholder="Ej: Testimonios Curso Fitness"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL pública *</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                /wall/
              </span>
              <Input
                id="slug"
                placeholder="mi-curso-fitness"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Solo letras, números y guiones
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Cuéntanos de qué trata este espacio..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thankYou">Mensaje de agradecimiento</Label>
            <Input
              id="thankYou"
              value={thankYou}
              onChange={(e) => setThankYou(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {space ? "Guardar cambios" : "Crear Espacio"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
