

"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";

function ZoomMeetingContent({ userName }: { userName: string }) {
  const searchParams = useSearchParams();
  const meetingNumber = searchParams.get("meetingNumber") || "";
  const password = searchParams.get("password") || "";
  const signature = searchParams.get("signature") || "";

  const params = new URLSearchParams({
    meetingNumber,
    password,
    signature,
    sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY!,
    userName,
    leaveUrl: window.location.origin + "/staff/dashboard/live-class",
  });

  return (
    <iframe
      src={`/zoom.html?${params.toString()}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
        zIndex: 9999,
      }}
      allow="camera; microphone; display-capture; fullscreen"
    />
  );
}

export default function ZoomMeetingPage() {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  const userName = user.email || "Guest";

  return (
    <Suspense fallback={<div>Loading Zoom...</div>}>
      <ZoomMeetingContent userName={userName} />
    </Suspense>
  );
}