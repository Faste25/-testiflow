"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Space } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Video,
  StopCircle,
  Trash2,
  Play,
  CheckCircle2,
} from "lucide-react";

interface TestimonialFormProps {
  space: Space;
}

export default function TestimonialForm({ space }: TestimonialFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobEvent["data"][]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  const { toast } = useToast();
  const supabase = createClient();

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoBlob(blob);
        setVideoUrl(url);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
          videoPreviewRef.current.src = url;
        }
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setRecording(true);
    } catch {
      toast({
        title: "No se pudo acceder a la cámara",
        description: "Verifica los permisos del navegador.",
        variant: "destructive",
      });
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  function deleteVideo() {
    setVideoBlob(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text && !videoBlob) {
      toast({
        title: "Faltan datos",
        description: "Escribe un testimonio o graba un video.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    try {
      let uploadedVideoUrl: string | null = null;

      if (videoBlob) {
        const fileName = `${space.id}/${Date.now()}.webm`;
        const { error: uploadError } = await supabase.storage
          .from("testimonial-videos")
          .upload(fileName, videoBlob, { contentType: "video/webm" });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("testimonial-videos")
          .getPublicUrl(fileName);
        uploadedVideoUrl = data.publicUrl;
      }

      const { error } = await supabase.from("testimonials").insert({
        space_id: space.id,
        submitter_name: name,
        submitter_email: email || null,
        text_content: text || null,
        video_url: uploadedVideoUrl,
        rating,
      });

      if (error) throw error;

      setSubmitted(true);
    } catch (err: unknown) {
      toast({
        title: "Error al enviar",
        description: err instanceof Error ? err.message : "Intenta de nuevo.",
        variant: "destructive",
      });
    }

    setLoading(false);
  }

  if (submitted) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-10 pb-10 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {space.thank_you_message}
          </h2>
          <p className="text-muted-foreground text-sm">
            Tu testimonio ha sido recibido y está pendiente de aprobación.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-2xl transition-transform hover:scale-110"
              >
                {star <= rating ? "⭐" : "☆"}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Tu nombre *</Label>
            <Input
              id="name"
              placeholder="María García"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (opcional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="maria@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {space.collect_text && (
            <div className="space-y-2">
              <Label htmlFor="text">Tu testimonio</Label>
              <Textarea
                id="text"
                placeholder="Comparte tu experiencia..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
              />
            </div>
          )}

          {space.collect_video && (
            <div className="space-y-3">
              <Label>Video (opcional)</Label>
              <div className="rounded-xl overflow-hidden bg-gray-900 aspect-video relative">
                <video
                  ref={videoPreviewRef}
                  className="w-full h-full object-cover"
                  muted={recording}
                  playsInline
                  controls={!!videoUrl && !recording}
                />
                {!recording && !videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-400 text-sm">Vista previa de cámara</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {!recording && !videoUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={startRecording}
                    className="flex-1"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Grabar video
                  </Button>
                )}
                {recording && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={stopRecording}
                    className="flex-1"
                  >
                    <StopCircle className="w-4 h-4 mr-2" />
                    Detener grabación
                  </Button>
                )}
                {videoUrl && !recording && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => videoPreviewRef.current?.play()}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={deleteVideo}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={loading || recording}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar testimonio
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
