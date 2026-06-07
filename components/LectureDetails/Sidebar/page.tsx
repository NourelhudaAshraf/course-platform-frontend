"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { SidebarProps } from "@/lib/types";

type SidebarComponentProps = SidebarProps & {
  onBeforeNavigate?: () => Promise<void>;
};

export default function Sidebar({
  isSidebarOpen,
  allLessons,
  lesson,
  completedLessons,
  onBeforeNavigate,
}: SidebarComponentProps) {
  const router = useRouter();

  const handleLessonClick = async (
    e: React.MouseEvent,
    targetLessonId: string,
  ) => {
    if (targetLessonId === lesson._id) return;
    e.preventDefault();
    await onBeforeNavigate?.();
    router.push(`/courses/${lesson.course._id}/lecture/${targetLessonId}`);
  };

  return (
    <aside
      className={`
            fixed lg:sticky top-16 lg:top-16 z-30
            min-w-80 bg-white border-r border-gray-200
            transition-transform duration-300 ease-in-out
            h-[calc(100vh-4rem)] overflow-hidden
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
    >
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Course Content</h2>
      </div>
      <ScrollArea className="h-[calc(100%-5rem)]">
        <div className="p-2 space-y-1">
          {allLessons.map((item) => {
            const isActive = item._id === lesson._id;
            const isCompleted = Boolean(completedLessons[item._id]);

            return (
              <a
                key={item._id}
                href={`/courses/${lesson.course._id}/lecture/${item._id}`}
                onClick={(e) => handleLessonClick(e, item._id)}
                className={`
                      flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer
                      ${
                        isActive
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }
                    `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 fill-green-50" />
                ) : isActive ? (
                  <PlayCircle className="h-5 w-5 text-blue-600 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300 shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      isActive
                        ? "text-blue-700"
                        : isCompleted
                          ? "text-gray-500"
                          : "text-gray-700"
                    }`}
                  >
                    {item.order}. {item.title}
                  </p>
                </div>

                {isActive && (
                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                    Current
                  </Badge>
                )}
              </a>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
