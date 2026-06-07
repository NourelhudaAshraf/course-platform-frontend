# Courses Platform Frontend Architecture & Development Rules

## Tech Stack

This project must strictly follow these technologies and patterns:

- Next.js App Router
- TypeScript
- TailwindCSS
- Shadcn UI
- React Hook Form
- Zod Validation
- Axios
- Server Actions for API calls
- React Player for video lessons

---

# Core Architecture Rules

## 1. Folder Structure

The app must follow feature-based architecture.

```txt
src/
│
├── app/
│   ├── (main)/
│   ├── admin/
│   │   ├── courses/
│   │   │   ├── create/
│   │   │   ├── edit/[id]/
│   │   │   ├── [id]/lessons/
│   │   ├── payments/
│   │   └── users/
│   │
│   ├── login/
│   └── signup/
│
├── components/
│   ├── shared/
│   ├── tables/
│   ├── forms/
│   ├── layouts/
│   ├── courses/
│   ├── lessons/
│   ├── payments/
│   └── ui/
│
├── actions/
│   ├── courses/
│   ├── lessons/
│   ├── payments/
│   └── users/
│
├── schemas/
│
├── lib/
│   ├── types/
│   ├── utils/
│   └── constants/
│
└── hooks/
```

---

# Important Restructure Rule

## Pages Must Stay Thin

Pages should ONLY:

- Fetch data
- Handle route params
- Render feature components

Pages must NOT:

- Contain large JSX
- Contain form logic
- Contain validation schema
- Contain table column logic
- Contain modal logic

BAD:

```tsx
export default function Page() {
  return <div>huge jsx here...</div>;
}
```

GOOD:

```tsx
import { CourseFormPage } from "@/components/courses/CourseFormPage";

export default function Page() {
  return <CourseFormPage />;
}
```

---

# Lazy Loading Rules

## Use dynamic imports for heavy components

Must use lazy loading for:

- React Player
- Tables
- Forms
- Large admin sections

Example:

```tsx
import dynamic from "next/dynamic";

const LessonsTable = dynamic(
  () => import("@/components/lessons/LessonsTable"),
  {
    loading: () => <div>Loading...</div>,
  },
);
```

---

# Shared Components Rules

## SharedTable

The existing SharedTable component must remain reusable and generic.

Rules:

- Never hardcode entity names
- Columns must always come from page/component level
- Keep loading state generic
- Reuse for payments, users, lessons, courses

---

# API Rules

## API Calls Structure

Every entity must have its own action file.

Example:

```txt
actions/
├── courses/
│   ├── getCourses.ts
│   ├── getCourse.ts
│   ├── createCourse.ts
│   ├── updateCourse.ts
│   └── deleteCourse.ts
```

---

## API Call Standards

Every action must:

- Use `"use server"`
- Use axios
- Use try/catch
- Throw meaningful errors
- Return only `res.data.data`

Example:

```ts
"use server";

import axios from "axios";

export async function getCourses() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/courses`,
    );

    if (res.status !== 200) {
      throw new Error("Failed to fetch courses");
    }

    return res.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch courses");
  }
}
```

---

# Form Rules

## React Hook Form + Zod

ALL forms must use:

- react-hook-form
- zod
- @hookform/resolvers/zod

---

## Validation Schema Structure

Schemas must be separated.

```txt
schemas/
├── course.schema.ts
├── lesson.schema.ts
└── payment.schema.ts
```

Example:

```ts
import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(1),
  image: z.string().min(1),
});
```

---

# Form Component Structure

## Forms Must Be Reusable

```txt
components/
├── forms/
│   ├── CourseForm.tsx
│   └── LessonForm.tsx
```

Rules:

- Same form used for create/edit
- Accept defaultValues
- Accept submit handler
- Accept loading state

---

# Course Feature Rules

# Create Course Page

Route:

```txt
/admin/courses/create
```

Responsibilities:

- Render reusable CourseForm
- Submit create course request
- Redirect after success
- Show toast messages

Fields:

- Title
- Description
- Price
- Image

After successful creation:

- Redirect to lessons management page

Example:

```txt
/admin/courses/[id]/lessons
```

---

# Edit Course Page

Route:

```txt
/admin/courses/edit/[id]
```

Responsibilities:

- Fetch course data
- Pass default values to form
- Update course
- Show loading skeleton

---

# Lessons Management Rules

# Manage Lessons Page

Route:

```txt
/admin/courses/[id]/lessons
```

Responsibilities:

- Fetch lessons
- Display lessons table
- Add lesson
- Edit lesson
- Delete lesson

---

# Lessons UI Rules

Lessons page should contain:

```txt
Header
Add Lesson Button
Lessons Table
```

Table columns:

- Title
- Video URL
- Order
- Actions

Actions:

- Edit
- Delete

---

# Lesson Form Rules

Fields:

- Title
- Video URL
- Order

Validation:

- title required
- valid URL
- order positive number

---

# Payments Feature Rules

# Admin Payments Page

Route:

```txt
/admin/payments
```

Endpoint:

```txt
/api/v1/enrollment
```

Display:

- User
- Course
- Price
- Payment Date

Use:

- SharedTable
- Skeleton loading
- Empty state

---

# Loading Rules

## Every async page must have:

- loading.tsx
- skeleton UI

---

# Error Handling Rules

## Never silently fail

Must:

- Show toast
- Throw readable error
- Handle loading state

Example:

```ts
toast.error("Failed to create course");
```

---

# UI/UX Rules

## Use consistent spacing

Preferred:

- gap-4
- gap-6
- space-y-6
- rounded-xl

---

## Cards

Use Shadcn Card component for:

- forms
- tables
- dashboard sections

---

## Buttons

Variants:

- default
- destructive
- outline

Avoid custom button styles unless necessary.

---

# Types Rules

## Every entity must have type

Example:

```ts
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}
```

---

# Naming Conventions

## Components

PascalCase:

```txt
CourseForm.tsx
LessonsTable.tsx
PaymentsPage.tsx
```

---

## Functions

camelCase:

```ts
getCourses;
createLesson;
updateCourse;
```

---

# React Rules

## Avoid unnecessary client components

Use server components by default.

Only use `"use client"` when:

- forms
- state
- effects
- event handlers

---

# Performance Rules

## Must use:

- dynamic imports
- memoization when needed
- server components for fetching
- pagination if data grows

---

# Suggested Final Structure

```txt
components/
├── courses/
│   ├── CourseFormPage.tsx
│   ├── CourseForm.tsx
│   ├── CoursesTable.tsx
│   └── CourseCard.tsx
│
├── lessons/
│   ├── LessonsManager.tsx
│   ├── LessonForm.tsx
│   ├── LessonsTable.tsx
│   └── LessonPlayer.tsx
│
├── payments/
│   ├── PaymentsTable.tsx
│   └── PaymentsPage.tsx
│
├── shared/
│   ├── SharedTable.tsx
│   ├── EmptyState.tsx
│   ├── LoadingSkeleton.tsx
│   └── PageHeader.tsx
```

---

# Recommended Implementation Order

## Step 1

Restructure folders

## Step 2

Create schemas

## Step 3

Create types

## Step 4

Create actions

## Step 5

Create reusable forms

## Step 6

Create reusable tables

## Step 7

Implement create/edit course

## Step 8

Implement lessons management

## Step 9

Implement payments page

## Step 10

Add loading/error states

---

# Important Project Standards

## DO NOT:

- Put business logic inside pages
- Duplicate forms
- Duplicate table logic
- Hardcode API URLs
- Mix fetching and UI heavily

## ALWAYS:

- Reuse components
- Keep pages clean
- Separate concerns
- Use typed data
- Use zod validation
- Use loading states
- Use dynamic imports for heavy sections
