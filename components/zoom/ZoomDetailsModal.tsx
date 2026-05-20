"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { IZoomMeeting } from "@/types/admin";
import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

interface ZoomDetailsModalProps {
  meeting: IZoomMeeting | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ZoomDetailsModal({
  meeting,
  isOpen,
  onClose,
}: ZoomDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!meeting) return null;

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColors = {
    SCHEDULED: "default",
    IN_PROGRESS: "secondary",
    COMPLETED: "outline",
    CANCELLED: "destructive",
  } as const;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-indigo-900 dark:text-indigo-50">
            {meeting.topic}
          </DialogTitle>
          <DialogDescription>{meeting.classTitle}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-100 pr-4">
          <div className="space-y-6 px-4">
            {/* Status & Duration */}
            <div className="flex items-center justify-between">
              <Badge
                variant={statusColors[meeting.status] || "default"}
                className="text-sm"
              >
                {meeting.status}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatDuration(meeting.duration)}
              </div>
            </div>

            <Separator />

            {/* Meeting Details Grid */}
            <div className="grid grid-cols-1 gap-6">
              {/* Date & Time */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
                  Start Date & Time
                </h3>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    {formatDate(meeting.startTime)}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
                  Duration
                </h3>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    {meeting.duration} minutes
                  </p>
                </div>
              </div>

              {/* Meeting ID */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
                  Meeting ID
                </h3>
                <div className="flex items-start gap-2">
                  <Video className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <p className="text-sm font-mono text-muted-foreground">
                    {meeting.meetingId}
                  </p>
                </div>
              </div>

              {/* Timezone */}
              {meeting.timezone && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
                    Timezone
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {meeting.timezone}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Join Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
                Meeting Links
              </h3>

              {/* Join URL */}
              <div className="space-y-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 p-3 border border-indigo-200 dark:border-indigo-800">
                <p className="text-xs font-medium text-indigo-900 dark:text-indigo-50">
                  Join URL
                </p>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={meeting.joinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={meeting?.joinUrl}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline truncate"
                  >
                    {meeting.joinUrl.slice(0, 30)}
                  </a>
                  <button
                    onClick={() => handleCopyLink(meeting.joinUrl)}
                    className="p-1 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded transition-colors"
                    title="Copy link"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* Start URL */}
              <div className="space-y-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 p-3 border border-indigo-200 dark:border-indigo-800">
                <p className="text-xs font-medium text-indigo-900 dark:text-indigo-50">
                  Start URL (Instructor Only)
                </p>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={meeting?.startUrl}
                    target="_blank"
                    title={meeting?.startUrl}
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline truncate"
                  >
                    {meeting?.startUrl?.slice(0, 30)}
                  </a>
                  <button
                    onClick={() => handleCopyLink(meeting?.startUrl ?? "")}
                    className="p-1 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded transition-colors"
                    title="Copy link"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Host Information */}
            {(meeting.hostEmail || meeting.hostId) && (
              <>
                <Separator />
                <div className="grid grid-cols-1 gap-6">
                  {meeting.hostEmail && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
                        Host Email
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {meeting.hostEmail}
                      </p>
                    </div>
                  )}
                  {meeting.hostId && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-50">
                        Host ID
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {meeting.hostId}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Password */}
            {meeting.password && (
              <>
                <Separator />
                <div className="space-y-2 rounded-lg bg-amber-50 dark:bg-amber-950 p-3 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs font-medium text-amber-900 dark:text-amber-50">
                    Meeting Password
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-mono text-amber-900 dark:text-amber-50">
                      {meeting.password}
                    </p>
                    <button
                      onClick={() => handleCopyLink(meeting?.password ?? "")}
                      className="p-1 hover:bg-amber-200 dark:hover:bg-amber-800 rounded transition-colors"
                      title="Copy password"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-amber-600" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button
            onClick={() => {
              window.open(meeting.joinUrl, "_blank");
            }}
            className="flex-1 hover:cursor-pointer bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Join Meeting
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
