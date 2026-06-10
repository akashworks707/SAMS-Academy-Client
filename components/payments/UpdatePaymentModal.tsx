"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { useAdminUpdatePaymentMutation } from "@/redux/features/payment/payment.api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const updatePaymentSchema = z.object({
    status: z.enum(["UNPAID", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"]),
    invoiceUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type UpdatePaymentFormValues = z.infer<typeof updatePaymentSchema>;

interface UpdatePaymentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: any;
    onSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UpdatePaymentModal({
    open, onOpenChange, item, onSuccess,
}: UpdatePaymentModalProps) {
    const [selectedStatus, setSelectedStatus] = useState<string>("UNPAID");
    const [adminUpdatePayment, { isLoading }] = useAdminUpdatePaymentMutation();

    const {
        register, handleSubmit,
        formState: { errors },
        reset, setValue,
    } = useForm<UpdatePaymentFormValues>({
        resolver: zodResolver(updatePaymentSchema) as any,
    });

    useEffect(() => {
        if (open && item) {
            const status = item.status ?? "UNPAID";
            setSelectedStatus(status);
            reset({
                status,
                invoiceUrl: item.invoiceUrl ?? "",
            });
        }
    }, [open, item, reset]);

    const onSubmit = async (data: UpdatePaymentFormValues) => {
        console.log("Submitting update with payload:", data);
        try {
            const payload: any = { status: data.status };
            if (data.invoiceUrl) payload.invoiceUrl = data.invoiceUrl;


            await adminUpdatePayment({ id: item._id, data: payload }).unwrap();
            toast.success("Payment updated successfully!");
            onOpenChange(false);
            onSuccess?.();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update payment");
        }
    };

    const enrollment = item?.enrollment;

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) onOpenChange(false); }}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
                <DialogHeader className="flex flex-col items-center gap-2 pb-2">
                    <DialogTitle className="text-xl font-bold tracking-widest uppercase">
                        Edit Payment
                    </DialogTitle>
                    <DialogDescription className="text-[#96999A] text-sm tracking-wide">
                        Update payment status — enrollment will sync automatically
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                {/* ── Read-only info card ── */}
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Transaction ID</span>
                        <span className="text-xs font-mono text-slate-700 dark:text-slate-300">{item?.transactionId ?? "—"}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Amount</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            ৳ {item?.amount?.toLocaleString() ?? "—"}
                        </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Enrollment Status</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {enrollment?.status ?? "—"}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
                            Update Details
                        </p>
                        <div className="space-y-4">

                            {/* Status */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold tracking-widest uppercase">
                                    Payment Status <span className="text-red-500">*</span>
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
                                        <SelectItem value="UNPAID">Unpaid</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="FAILED">Failed</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                        <SelectItem value="REFUNDED">Refunded</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-xs text-red-400">{errors.status.message}</p>
                                )}
                            </div>

                            {/* Invoice URL */}
                            <div className="space-y-1.5">
                                <Label htmlFor="p-invoice" className="text-xs font-semibold tracking-widest uppercase">
                                    Invoice URL{" "}
                                    <span className="text-[#96999A] normal-case font-normal">(optional)</span>
                                </Label>
                                <Input
                                    id="p-invoice"
                                    placeholder="https://invoice.example.com/..."
                                    {...register("invoiceUrl")}
                                />
                                {errors.invoiceUrl && (
                                    <p className="text-xs text-red-400">{errors.invoiceUrl.message}</p>
                                )}
                            </div>

                        </div>
                    </div>

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
                                <CreditCard className="h-4 w-4" />
                                Update Payment
                            </span>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}