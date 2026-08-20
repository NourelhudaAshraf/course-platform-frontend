"use client";

import { useEffect, useState } from "react";
import { Video } from "lucide-react";

export default function VideoPreview({ src }: { readonly src: string | null }) {
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setLoadFailed(false);
  }, [src]);

  if (!src || loadFailed) {
    return (
      <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 px-4 text-center text-gray-400">
        <Video className="h-10 w-10 stroke-[1.5]" />
        <p className="text-sm">
          {loadFailed
            ? "Could not load video. Try another file."
            : "Upload a video to see a preview"}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/80 p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
        Video preview
      </p>
      <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-lg border bg-black shadow-sm">
        <video
          key={src}
          src={src}
          controls
          className="h-full w-full object-contain"
          onError={() => setLoadFailed(true)}
        />
      </div>
    </div>
  );
}
