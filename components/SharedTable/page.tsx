/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableSkeleton } from "@/components/TableSkeleton/page";
import { SharedDataTableProps } from "@/lib/types";

export function SharedTable<T>({
  title,
  description,
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyMessage = "No data found",
  skeletonRows = 4,
  skeletonColumns = 4,
}: SharedDataTableProps<T>) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-200 rounded mt-2 animate-pulse" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TableSkeleton columns={skeletonColumns} rows={skeletonRows} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <CardDescription className="mt-2">{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      {!data.length ? (
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`
                      py-3 px-4 text-sm font-medium text-gray-500
                      ${column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left"}
                      ${column.className || ""}
                    `}
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr
                    key={keyExtractor(item)}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`
                        py-3 px-4
                        ${column.minWidth ? `min-w-[${column.minWidth}px]` : ""}
                        ${column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left"}
                        ${column.className || ""}
                      `}
                      >
                        {column.render
                          ? column.render(item)
                          : (item as any)[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
