"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  isLoading?: boolean;
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

export function FormDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  isLoading = false,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
}: FormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="py-4">
          {children}
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          {onSubmit && (
            <Button
              onClick={onSubmit}
              disabled={isLoading}
            >
              {submitLabel}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
