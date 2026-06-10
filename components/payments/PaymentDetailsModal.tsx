// components/modals/PaymentDetailsModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useGetSingleEnrollmentQuery } from "@/redux/features/enrollment/enrollment.api";

// ─── Status Badge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    COMPLETED:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
    UNPAID:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    FAILED:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400",
    CANCELLED:
      "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400",
    REFUNDED:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    // enrollment statuses
    PENDING:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
  };
  const dot: Record<string, string> = {
    COMPLETED: "bg-emerald-500",
    UNPAID: "bg-amber-500",
    FAILED: "bg-red-500",
    CANCELLED: "bg-slate-400",
    REFUNDED: "bg-blue-500",
    PENDING: "bg-amber-500",
  };
  return (
    <Badge variant="outline" className={map[status] ?? ""}>
      <span
        className={`h-1.5 w-1.5 rounded-full mr-1.5 inline-block ${dot[status] ?? "bg-slate-400"}`}
      />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}

// ─── Props ──────────────────────────────────────────────────────────────────────

interface PaymentDetailsModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: any;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PaymentDetailsModal({
  open,
  onOpenChange,
  item,
}: PaymentDetailsModalProps) {
  if (!item) return null;

  const enrollment = item.enrollment;
  console.log("Enrollment in details modal:", enrollment);
  const {data: enrollmentDetails} = useGetSingleEnrollmentQuery(enrollment?._id);
  console.log(enrollmentDetails);

  const paymentRows: { label: string; value: React.ReactNode }[] = [
    { label: "Payment ID", value: item._id },
    { label: "Transaction ID", value: item.transactionId },
    {
      label: "Amount",
      value: <span className="font-bold">৳ {item.amount?.toLocaleString()}</span>,
    },
    {
      label: "Payment Status",
      value: <StatusBadge status={item.status} />,
    },
    {
      label: "Invoice URL",
      value: item.invoiceUrl ? (
        <a
          href={item.invoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline text-xs truncate max-w-50 block"
        >
          {item.invoiceUrl}
        </a>
      ) : "—",
    },
    {
      label: "Created At",
      value: new Date(item.createdAt).toLocaleString("en-GB"),
    },
    {
      label: "Updated At",
      value: new Date(item.updatedAt).toLocaleString("en-GB"),
    },
  ];

  const enrollmentRows: { label: string; value: React.ReactNode }[] = enrollment
    ? [
        { label: "Enrollment For", value: enrollmentDetails?.data.course?.title ?? "—" },
        { label: "Pay By", value: `${enrollmentDetails?.data?.student?.name ?? "—"}(${enrollmentDetails?.data?.student?.email ?? "—"})` },
        {
          label: "Enrollment Status",
          value: <StatusBadge status={enrollment?.status} />,
        }
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="flex flex-col items-center gap-2 pb-2">
          <DialogTitle className="text-xl font-bold tracking-widest uppercase">
            Payment Details
          </DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            Full payment & enrollment information
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {/* ── Payment Info ── */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
            Payment Info
          </p>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
            {paymentRows.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-2.5 gap-4"
              >
                <span className="text-[11px] font-semibold tracking-widest uppercase text-slate-400 shrink-0">
                  {label}
                </span>
                <span className="text-xs text-slate-700 dark:text-slate-300 text-right font-mono break-all">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Linked Enrollment ── */}
        {enrollment && (
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
              Linked Enrollment
            </p>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
              {enrollmentRows.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-4 py-2.5 gap-4"
                >
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-slate-400 shrink-0">
                    {label}
                  </span>
                  <span className="text-xs text-slate-700 dark:text-slate-300 text-right font-mono">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}