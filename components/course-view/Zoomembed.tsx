
"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZoomEmbedProps {
  meetingNumber: string;
  password: string;
  userName: string;
  sdkKey: string;
  signature: string;
  onLeave?: () => void;
}

export function ZoomEmbed({
  meetingNumber,
  password,
  userName,
  sdkKey,
  signature,
  onLeave,
}: ZoomEmbedProps) {
  const [status, setStatus] = useState<"loading" | "joined" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const iframeSrc = (() => {
    const p = new URLSearchParams({ meetingNumber, password, userName, sdkKey, signature });
    return `/zoom-meeting.html?${p.toString()}`;
  })();

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const { type, data } = event.data ?? {};
      if (type === "joined") {
        setStatus("joined");
      } else if (type === "leave") {
        onLeave?.();
      } else if (type === "error") {
        setErrorMsg(data?.message ?? "Failed to join meeting");
        setStatus("error");
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onLeave]);

  // Calculate height: viewport height minus the header bars above
  const [iframeHeight, setIframeHeight] = useState(640);
  useEffect(() => {
    function updateHeight() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Fill from current position to bottom of viewport with some padding
        const available = window.innerHeight - rect.top - 16;
        setIframeHeight(Math.max(500, available));
      }
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-max rounded-xl overflow-hidden bg-slate-900" style={{ height: iframeHeight }}>

      {/* Loading overlay */}
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10 gap-3 pointer-events-none">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Joining meeting...</p>
          <p className="text-xs text-slate-500">Please allow camera & microphone access when prompted</p>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10 gap-4 px-6">
          <WifiOff className="w-12 h-12 text-red-400 opacity-60" />
          <p className="text-base font-semibold text-white">Failed to join</p>
          <p className="text-sm text-slate-400 text-center max-w-sm">{errorMsg}</p>
          {onLeave && (
            <Button variant="outline" size="sm" onClick={onLeave}>Go back</Button>
          )}
        </div>
      )}

      {/* iframe fills the container — Zoom Component View renders inside */}
      <iframe
        src={iframeSrc}
        className="w-full h-full border-0"
        allow="camera; microphone; display-capture; autoplay; clipboard-write; encrypted-media; fullscreen"
        allowFullScreen
        title="Live Class"
        style={{ opacity: status === "loading" ? 0 : 1, transition: "opacity 0.4s" }}
      />
    </div>
  );
}