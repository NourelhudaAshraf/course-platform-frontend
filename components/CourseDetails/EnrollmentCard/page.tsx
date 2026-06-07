"use client";
import Link from "next/link";
import { PlayCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnrollmentCardProps } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";

export default function EnrollmentCard({
  price,
  id,
  courseUserName,
  lessonsLength,
  lessonId,
  isEnrolled,
  isEnrolling,
  handleEnroll,
  checkEnrolled,
}: EnrollmentCardProps) {
  if (checkEnrolled)
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 bg-white rounded-xl shadow-lg border overflow-hidden">
        {/* Price Section */}
        <div className="p-6 border-b">
          <div className="text-center">
            <span className="text-4xl font-bold text-gray-900">${price}</span>
            <p className="text-sm text-gray-500 mt-1">One-time payment</p>
          </div>
        </div>

        {/* Enroll Button */}
        <div className="p-4">
          {isEnrolled ? (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 min-h-10"
              asChild
            >
              <Link href={`/courses/${id}/lecture/${lessonId}`}>
                <PlayCircle className="h-4 w-4 mr-2" />
                Continue Learning
              </Link>
            </Button>
          ) : (
            <Button
              onClick={handleEnroll}
              disabled={isEnrolling}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
            >
              {isEnrolling ? "Processing..." : `Enroll Now - $${price}`}
            </Button>
          )}
        </div>

        {/* Course Includes */}
        <div className="p-6 bg-gray-50 border-t">
          <h3 className="font-semibold text-gray-900 mb-3">
            This course includes:
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {lessonsLength || 0} on-demand video lessons
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Full lifetime access
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Certificate of completion
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Instructor Q&A support
            </li>
          </ul>
        </div>

        {/* User Info */}
        <div className="p-6 border-t">
          <h3 className="font-semibold text-gray-900 mb-3">Created by</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              {courseUserName.charAt(0).toUpperCase()}
            </div>
            <p className="font-medium text-gray-900">{courseUserName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
