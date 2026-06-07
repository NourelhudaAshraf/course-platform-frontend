import { LessonsSectionProps } from "@/lib/types";
import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function LessonsSection({
  lessons,
  isEnrolled,
  completedLessons = {},
}: LessonsSectionProps) {
  const completedCount = lessons.filter((lesson) =>
    Boolean(completedLessons[lesson._id]),
  ).length;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Course Content</h2>
        {isEnrolled && (
          <Badge className="bg-green-100 text-green-700 text-sm">
            {completedCount}/{lessons.length} completed
          </Badge>
        )}
      </div>

      {!isEnrolled && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-800 flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Full lessons are available after enrollment. Preview lessons are
            shown below.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {lessons && lessons.length > 0 ? (
          lessons.map((lesson, index) => {
            const isCompleted = Boolean(completedLessons[lesson._id]);

            return (
              <Link
                key={lesson._id}
                href={`/courses/${lesson.course._id}/lecture/${lesson._id}`}
                className={`flex items-center justify-between p-3 rounded-lg border transition ${
                  isEnrolled
                    ? "border-blue-200 bg-blue-50/30 cursor-pointer hover:bg-blue-50"
                    : "border-gray-100 hover:bg-gray-50 pointer-events-none"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isEnrolled ? (
                    isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 fill-green-50" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300 shrink-0" />
                    )
                  ) : (
                    <PlayCircle className="h-5 w-5 text-blue-500 shrink-0" />
                  )}
                  <div>
                    <p
                      className={`font-medium ${
                        isEnrolled
                          ? isCompleted
                            ? "text-gray-500"
                            : "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {index + 1}. {lesson.title}
                    </p>
                  </div>
                </div>
                {!isEnrolled && (
                  <Badge className="text-blue-600 border-blue-200 bg-white">
                    Preview
                  </Badge>
                )}
              </Link>
            );
          })
        ) : (
          <p className="text-gray-500 text-center py-8">
            No lessons available yet. Check back soon!
          </p>
        )}
      </div>
    </div>
  );
}
