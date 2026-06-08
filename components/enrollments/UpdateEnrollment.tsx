"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useUpdateEnrollmentMutation } from "@/redux/features/enrollment/enrollment.api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const updateEnrollmentSchema = z.object({
    transactionId: z.string().optional(),
    status: z.enum(["PENDING", "COMPLETED", "FAILED", "CANCELLED"]),
    progress: z.preprocess(
        (val) => (val !== "" && val !== undefined ? Number(val) : 0),
        z.number().min(0).max(100)
    ),
});

type UpdateEnrollmentFormValues = z.infer<typeof updateEnrollmentSchema>;

interface UpdateEnrollmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: any;
    onSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UpdateEnrollmentModal({
    open,
    onOpenChange,
    item,
    onSuccess,
}: UpdateEnrollmentModalProps) {
    const [selectedStatus, setSelectedStatus] = useState<string>("PENDING");

    const [updateEnrollment, { isLoading }] = useUpdateEnrollmentMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<UpdateEnrollmentFormValues>({
        resolver: zodResolver(updateEnrollmentSchema) as any,
    });

    useEffect(() => {
        if (open && item) {
            const status = item.status ?? "PENDING";
            setSelectedStatus(status);
            reset({
                transactionId: item.transactionId ?? "",
                status,
                progress: item.progress ?? 0,
            });
        }
    }, [open, item, reset]);

    const handleClose = () => {
        onOpenChange(false);
    };

    const onSubmit = async (data: UpdateEnrollmentFormValues) => {
        try {
            const payload: any = {
                status: data.status,
                progress: data.progress,
            };
            if (data.transactionId) payload.transactionId = data.transactionId;

            await updateEnrollment({ id: item._id, data: payload }).unwrap();
            toast.success("Enrollment updated successfully!");
            handleClose();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update enrollment");
        }
    };

    const student = item?.student;
    const course = item?.course;

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                if (!val) handleClose();
                else onOpenChange(true);
            }}
        >
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
                <DialogHeader className="flex flex-col items-center gap-2 pb-2">
                    <DialogTitle className="text-xl font-bold tracking-widest uppercase">
                        Edit Enrollment
                    </DialogTitle>
                    <DialogDescription className="text-[#96999A] text-sm tracking-wide">
                        Update enrollment status and progress
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                {/* Read-only context card */}
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
                    {/* Student row */}
                    <div className="flex items-center gap-3">
                        {student?.picture ? (
                            <img
                                src={student.picture}
                                alt={student.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
                                {student?.name?.charAt(0)?.toUpperCase() ?? "S"}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Student</p>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                                {student?.name ?? "—"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {student?.studentId ?? student?.email ?? "—"}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Course row */}
                    <div className="flex items-center gap-3">
                        {course?.thumbnail ? (
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-10 h-10 rounded object-cover shrink-0"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5 text-slate-400" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Course</p>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                                {course?.title ?? "—"}
                            </p>
                            {course?.batch && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">{course.batch}</p>
                            )}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* ─── Enrollment Update ─── */}
                    <div>
                        <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
                            Update Details
                        </p>
                        <div className="space-y-4">

                            {/* Status */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold tracking-widest uppercase">
                                    Status <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={selectedStatus}
                                    onValueChange={(v) => {
                                        if (!v) return;
                                        setSelectedStatus(v);
                                        setValue("status", v as any, { shouldValidate: true });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="FAILED">Failed</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-xs text-red-400">{errors.status.message}</p>
                                )}
                            </div>

                            {/* Progress */}
                            {/* <div className="space-y-1.5">
                                <Label htmlFor="e-progress" className="text-xs font-semibold tracking-widest uppercase">
                                    Progress (0–100%)
                                </Label>
                                <Input
                                    id="e-progress"
                                    type="number"
                                    min={0}
                                    max={100}
                                    placeholder="e.g. 50"
                                    {...register("progress")}
                                />
                                {errors.progress && (
                                    <p className="text-xs text-red-400">{errors.progress.message}</p>
                                )}
                            </div> */}

                            {/* Transaction ID */}
                            <div className="space-y-1.5">
                                <Label htmlFor="e-txn" className="text-xs font-semibold tracking-widest uppercase">
                                    Transaction ID <span className="text-[#96999A] normal-case font-normal">(optional)</span>
                                </Label>
                                <Input
                                    id="e-txn"
                                    placeholder="e.g. TXN-1234567890"
                                    {...register("transactionId")}
                                />
                            </div>

                        </div>
                    </div>

                    {/* ─── Submit ─── */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full cursor-pointer font-bold tracking-widest uppercase transition-colors disabled:opacity-60"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Updating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Update Enrollment
                            </span>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}