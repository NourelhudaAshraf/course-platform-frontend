"use client";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function CourseImagePreview({
  src,
}: {
  readonly src: string | null;
}) {
  const [loadFailed, setLoadFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || loadFailed) {
    return (
      <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 px-4 text-center text-gray-400">
        <ImageIcon className="h-10 w-10 stroke-[1.5]" />
        <p className="text-sm">
          {loadFailed
            ? "Could not load image. Try another file."
            : "Upload an image to see a preview"}
        </p>
      </div>
    );
  }

  return (
    <>
      {!loaded && <Skeleton className="absolute inset-0 h-full w-full" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Course preview"
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setLoadFailed(true)}
      />
    </>
  );
}
