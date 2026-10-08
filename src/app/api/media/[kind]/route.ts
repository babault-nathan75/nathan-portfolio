import { getMedia, type MediaKind } from "@/lib/db";

const KINDS: MediaKind[] = ["photo", "cv"];

/**
 * Sert les fichiers uploadés depuis la base (photo de profil, CV).
 * Le fallback statique (/nathan.png, /cv-nathan-babault.pdf) reste utilisé
 * côté composant quand la table media est vide.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ kind: string }> }
) {
  const { kind } = await params;
  if (!KINDS.includes(kind as MediaKind)) {
    return new Response("Not found", { status: 404 });
  }

  let media;
  try {
    media = await getMedia(kind as MediaKind);
  } catch {
    return new Response("Service indisponible", { status: 503 });
  }

  if (!media) {
    return new Response("Not found", { status: 404 });
  }

  const buffer = Buffer.from(media.data, "base64");
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": media.mime,
      "Content-Length": String(buffer.length),
      "Content-Disposition": `inline; filename="${encodeURIComponent(media.filename)}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
