import React from "react";

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
    {children}
    </main>
  );
}
