/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, VideoOff } from "lucide-react";
import { useLazyGetSignatureQuery } from "@/redux/features/zoom/zoom.api";
import { IZoomMeeting } from "@/types/admin";

interface ZoomMeetingEmbedModalProps {
  meeting: IZoomMeeting | null;
  isOpen: boolean;
  role?: 0 | 1;
  userName?: string;
  userEmail?: string;
  onClose: () => void;
}

export function ZoomMeetingEmbedModal({
  meeting,
  isOpen,
  role = 0,
  userName = "",
  userEmail = "",
  onClose,
}: ZoomMeetingEmbedModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fetchSignature] = useLazyGetSignatureQuery();

  useEffect(() => {
    if (!isOpen || !meeting || !containerRef.current) return;

    let mounted = true;

    const initMeeting = async () => {
      try {
        setLoading(true);
        setError("");

        // Dynamic import (important for React 19 + Next 16)
        const ZoomSDK = await import("@zoom/meetingsdk/embedded");
        const ZoomMtgEmbedded = ZoomSDK.default;

        const sigRes = await fetchSignature({
          meetingNumber: meeting.meetingId,
          role,
        }).unwrap();

        const signature = sigRes?.signature;

        if (!signature) {
          throw new Error("Signature missing");
        }

        const client = ZoomMtgEmbedded.createClient();
        clientRef.current = client;

        await client.init({
          zoomAppRoot: containerRef.current || undefined,
          language: "en-US",
          patchJsMedia: true,
          customize: {
            meetingInfo: ["topic", "host", "mn", "participant"],
            toolbar: {
              buttons: [],
            },
          },
        });

        if (!mounted) return;

        await client.join({
          sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY!,
          signature,
          meetingNumber: meeting.meetingId,
          password: meeting.password || "",
          userName,
          userEmail,
        });

        setLoading(false);
      } catch (err) {
        console.error("Zoom error:", err);
        setError("Failed to join Zoom meeting");
        setLoading(false);
      }
    };

    void initMeeting();

    return () => {
      mounted = false;

      if (clientRef.current) {
        try {
          clientRef.current.leaveMeeting();
        } catch {}

        clientRef.current = null;
      }
    };
  }, [isOpen, meeting, role, userName, userEmail, fetchSignature]);

  if (!meeting) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[92vh] p-0 overflow-hidden">
        <div className="relative w-full h-full bg-black">
          {loading && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white gap-4">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p>Joining Zoom meeting...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white gap-4">
              <p>{error}</p>

              <Button variant="destructive" onClick={onClose}>
                <VideoOff className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
          )}

          <div ref={containerRef} className="w-full h-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
