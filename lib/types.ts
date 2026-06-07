/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { ProfileFormData } from "./schemas/profile";

export type NavbarProps = {
  readonly name?: string;
  readonly role?: string;
};

export type FooterLinks = {
  readonly href: string;
  readonly children: React.ReactNode;
};

export type CourseProps = {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  user: {
    _id: string;
    name: string;
  };
  createdAt: string;
};

export type LessonProps = {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  course: {
    _id: string;
    title: string;
  };
  order: number;
  totalSeconds?: number;
  createdAt?: string;
};

export type UserLessonProps = {
  _id: string;
  user: string;
  lesson: string;
  lastPosition: number;
  progress: number;
  completed: boolean;
};

export type UserLessonSummary = {
  completed: boolean;
  lastPosition: number;
};

export type PaymentProps = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email?: string;
  };
  course: {
    _id: string;
    title: string;
    price?: number;
  };
  price: number;
  createdAt: string;
};

export type CourseFormPageProps = {
  readonly courseId?: string;
};

export type LessonsManagerProps = {
  readonly courseId: string;
};

export type CourseFormComponentProps = {
  readonly defaultValues?: {
    title: string;
    description: string;
    price: number;
    image: string;
  };
  readonly onSubmit: (
    data: import("./schemas/course.schema").CourseFormData,
  ) => Promise<void>;
  readonly loading?: boolean;
  readonly submitLabel?: string;
};

export type LessonFormComponentProps = {
  readonly course?: {
    title: string;
    description: string;
    price: number;
    image: string;
  };
  readonly defaultValues?: {
    title: string;
    order: number;
  };
  readonly existingVideoUrl?: string;
  readonly isEdit?: boolean;
  readonly onSubmit: (
    data: import("./schemas/lesson.schema").LessonFormSubmitData,
  ) => Promise<void>;
  readonly loading?: boolean;
  readonly submitLabel?: string;
};

export type SearchData = {
  title?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: { price: string };
};

export type SearchSectionProps = {
  readonly getCourses?: (searchData?: SearchData) => void;
};

export type CourseCardProps = {
  readonly course: CourseProps;
  readonly showPrice?: boolean;
  readonly buttonTitle?: string;
};

export type CourseSectionProps = {
  readonly coursesList: CourseProps[] | undefined;
};

export type PaginationProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
};

export type CourseDetailsPageProps = {
  params: {
    id: string;
  };
};

export type LectureDetailsPageProps = {
  params: {
    id: string;
    lessonId: string;
  };
};

export type SessionProps = {
  url: string;
};

export type CourseDetailsProps = {
  readonly course: CourseProps;
  readonly lessons: LessonProps[];
  readonly userLessons?: Record<string, UserLessonSummary>;
  readonly user?: UserProps;
};

export type LessonsSectionProps = {
  readonly lessons: LessonProps[];
  readonly isEnrolled: boolean;
  readonly completedLessons?: Record<string, boolean>;
};

export type LectureDetailsProps = {
  readonly lesson: LessonProps;
  readonly allLessons: LessonProps[];
  readonly userLessons?: Record<string, UserLessonSummary>;
};

export type BreadcrumbProps = {
  readonly courseTitle: string;
  readonly lessonTitle?: string;
  readonly courseId?: string;
};

export type EnrollmentCardProps = {
  readonly price: number;
  readonly id: string;
  readonly courseUserName: string;
  readonly lessonsLength: number;
  readonly lessonId: string | undefined;
  readonly isEnrolled: boolean;
  readonly isEnrolling: boolean;
  readonly handleEnroll: () => void;
  readonly checkEnrolled: boolean;
};

export type NavLinkProps = {
  readonly name: string;
  readonly href: string;
  readonly requiresAuth?: boolean;
};

export type MobileMenuProps = {
  readonly navLinks: NavLinkProps[];
  readonly pathname: string;
  readonly name?: string;
  readonly role?: string;
  readonly setIsMobileMenuOpen: (menuOpen: boolean) => void;
  readonly handleLogout: () => void;
};

export type AvatarMenuProps = {
  readonly name: string;
  readonly handleLogout: () => void;
  readonly role?: string;
};

export type RangeSliderProps = {
  readonly priceRange: number[];
  readonly setPriceRange: (priceR: number[]) => void;
};

export type FilterAndSortProps = {
  readonly showFilters: boolean;
  readonly setShowFilters: (showFilters: boolean) => void;
  readonly sortBy: string;
  readonly setSortBy: (sort: string) => void;
};

export type SidebarProps = {
  readonly isSidebarOpen: boolean;
  readonly allLessons: LessonProps[];
  readonly lesson: LessonProps;
  readonly completedLessons: Record<string, boolean>;
};

export type EnrollProps = {
  readonly course: CourseProps;
};

export type ProfileFormProps = {
  readonly name: string;
  readonly email: string;
  readonly saveData: (data: ProfileFormData) => Promise<ProfileFormData>;
};

export type UserProps = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export type StatsProps = {
  readonly totalUsers: number;
  readonly totalCourses: number;
  readonly totalEnrollments: number;
  readonly totalRevenue: number;
  readonly revenueChange: number;
  readonly newUsersThisMonth: number;
  readonly newEnrollmentsThisMonth: number;
  readonly recentUsers: UserProps[];
};

export type StatsPageProps = {
  readonly stats?: StatsProps;
};

export type RecentUsersProps = {
  readonly users?: UserProps[];
  readonly loading: boolean;
};

export type TableSkeletonProps = {
  readonly columns: number;
  readonly rows: number;
};

export type AdminSidebarProps = {
  readonly userName: string;
};

export type Column<T = any> = {
  readonly key: string;
  readonly title: string;
  readonly render?: (item: T) => ReactNode;
  readonly className?: string;
  readonly align?: "left" | "right" | "center";
};

export type SharedDataTableProps<T = any> = {
  readonly title: string;
  readonly description?: string;
  readonly columns: Column<T>[];
  readonly data: T[];
  readonly keyExtractor: (item: T) => string;
  readonly loading?: boolean;
  readonly emptyMessage?: string;
  readonly skeletonRows?: number;
  readonly skeletonColumns?: number;
};
