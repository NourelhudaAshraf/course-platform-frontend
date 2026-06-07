/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  CourseDetailsProps,
  UserLessonSummary,
  UserProps,
  LessonProps,
  CourseProps,
} from "@/lib/types";
import Image from "next/image";
import { User, BookOpen, Clock } from "lucide-react";
import BreadcrumbC from "../Breadcrumb/page";
import LessonsSection from "./LessonsSection/page";
import EnrollmentCard from "./EnrollmentCard/page";
import { useEffect, useState } from "react";
import enrollFromAPI, { checkIsCourseEnrolled } from "@/actions/enroll";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export default function CourseDetails({
  course,
  lessons,
  userLessons = {},
}: CourseDetailsProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkEnrolled, setCheckEnrolled] = useState(true);

  async function handleEnroll() {
    try {
      setIsEnrolling(true);
      const session = await enrollFromAPI(course._id);
      if (session) window.location.replace(session.url);
    } catch (e: any) {
      console.log("error: ", e);
      toast.error(e.message);
    } finally {
      setIsEnrolling(false);
    }
  }

  const isCourseEnrolled = async () => {
    try {
      const isCourseEn = await checkIsCourseEnrolled(course._id);
      setIsEnrolled(isCourseEn);
    } catch (e: any) {
      console.log("error: ", e);
      toast.error(e.message);
    } finally {
      setCheckEnrolled(false);
    }
  };
  useEffect(() => {
    if (course) isCourseEnrolled();
  }, [course]);

  if (!course)
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <BreadcrumbC courseTitle={course.title} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-5">
          {/* Left Column - Course Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Image */}
            <div className="relative w-full h-96 rounded-xl overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
              {course.image ? (
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <BookOpen className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Course Title & Meta */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {course.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>By {course.user.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>42 Hours</span>
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="text-xl font-semibold mb-3">About This Course</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
            </div>

            {/* Lessons List (Preview Only) */}
            <LessonsSection
              lessons={lessons}
              isEnrolled={isEnrolled}
              completedLessons={Object.fromEntries(
                Object.entries(userLessons).map(([id, record]) => [
                  id,
                  record.completed,
                ]),
              )}
            />
          </div>

          {/* Right Column - Enrollment Card */}
          <EnrollmentCard
            courseUserName={course.user.name}
            lessonsLength={lessons.length}
            price={course.price}
            id={course._id}
            lessonId={lessons.length > 1 ? lessons[0]._id : undefined}
            isEnrolled={isEnrolled}
            isEnrolling={isEnrolling}
            checkEnrolled={checkEnrolled}
            handleEnroll={handleEnroll}
          />
        </div>
      </div>
    </div>
  );
}
