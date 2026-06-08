"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseCardProps } from "@/lib/types";

export default function CourseCard({
  course,
  showPrice = true,
  buttonTitle = "View Details",
}: CourseCardProps) {
  const trimmedDescription =
    course?.description.length > 120
      ? `${course?.description.substring(0, 120)}...`
      : course?.description;

  return (
    <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200">
      {/* Image Section */}
      <div className="relative overflow-hidden h-48 bg-linear-to-br from-gray-100 to-gray-200">
        {course?.image ? (
          <Image
            src={course?.image}
            alt={course?.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-3xl">📚</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">No image available</p>
            </div>
          </div>
        )}

        {showPrice && (
          <Badge className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700">
            ${course?.price}
          </Badge>
        )}
      </div>

      <CardHeader>
        {/* Title */}
        <Link href={`/courses/${course?._id}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 min-h-[36px]">
            {course?.title}
          </h3>
        </Link>

        {/* Instructor Name */}
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span className="font-bold">{course?.user.name}</span>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Short Description (trimmed) */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 max-h-[50px]">
          {trimmedDescription}
        </p>
      </CardContent>
      <CardFooter className="pt-3 flex gap-2 ">
        {showPrice && (
          <div className="flex-1">
            {course?.price === 0 ? (
              <span className="text-2xl font-bold text-green-600">Free</span>
            ) : (
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  ${course?.price}
                </span>
                {course?.price > 0 && (
                  <span className="text-xs text-gray-500 ml-1">USD</span>
                )}
              </div>
            )}
          </div>
        )}
        {/* View Details Button */}
        <Button
          asChild
          className={`bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ${showPrice ? "" : "w-full"}`}
        >
          <Link
            href={`/courses/${course?._id}`}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {buttonTitle}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
