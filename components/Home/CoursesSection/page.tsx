import CourseCard from "@/components/CourseCard/page";
import { CourseProps, CourseSectionProps } from "@/lib/types";

export default function CoursesSection({ coursesList }: CourseSectionProps) {
  return (
    <>
      {coursesList?.length ? (
        <div className="max-w-7xl mx-auto px-4 py-12" id="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesList?.map((course: CourseProps) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <p className="mx-auto text-xl text-gray-600">No courses yet!</p>
        </div>
      )}
    </>
  );
}
