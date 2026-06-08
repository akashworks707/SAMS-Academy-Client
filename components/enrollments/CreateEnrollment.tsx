
"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, BookOpen, ChevronsUpDown, Check } from "lucide-react";

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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

import { useCreateEnrollmentMutation } from "@/redux/features/enrollment/enrollment.api";
import { useGetAllStudentsQuery } from "@/redux/features/user/user.api";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";

// ─── Schema ───────────────────────────────────────────────────────────────────

const createEnrollmentSchema = z.object({
    student: z.string().min(1, "Please select a student"),
    course: z.string().min(1, "Please select a course"),
    transactionId: z.string().optional(),
    status: z.enum(["PENDING", "COMPLETED", "FAILED", "CANCELLED"]).default("PENDING"),
});

type CreateEnrollmentFormValues = z.infer<typeof createEnrollmentSchema>;

interface CreateEnrollmentModalProps {
    onSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateEnrollmentModal({ onSuccess }: CreateEnrollmentModalProps) {
    const [open, setOpen] = useState(false);

    // combobox open states
    const [studentPopoverOpen, setStudentPopoverOpen] = useState(false);
    const [coursePopoverOpen, setCoursePopoverOpen] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState<string>("PENDING");
    const [selectedStudent, setSelectedStudent] = useState<string>("");
    const [selectedCourse, setSelectedCourse] = useState<string>("");

    const [createEnrollment, { isLoading }] = useCreateEnrollmentMutation();
    const { data: studentsData } = useGetAllStudentsQuery({ page: 1, limit: 10000 });
    const { data: coursesData } = useGetCoursesQuery({ page: 1, limit: 100 });

    const students: any[] = studentsData?.data ?? [];
    const courses: any[] = coursesData?.data ?? [];

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<CreateEnrollmentFormValues>({
        resolver: zodResolver(createEnrollmentSchema) as any,
        defaultValues: {
            student: "",
            course: "",
            transactionId: "",
            status: "PENDING",
        },
    });

    const handleClose = () => {
        reset();
        setSelectedStatus("PENDING");
        setSelectedStudent("");
        setSelectedCourse("");
        setOpen(false);
    };

    const onSubmit = async (data: CreateEnrollmentFormValues) => {
        try {
            const payload: any = {
                student: data.student,
                course: data.course,
                status: data.status,
            };
            if (data.transactionId) payload.transactionId = data.transactionId;

            await createEnrollment(payload).unwrap();
            toast.success("Enrollment created successfully!");
            handleClose();
            onSuccess?.();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create enrollment");
        }
    };

    // Helpers to get display labels
    const selectedStudentObj = students.find((s) => s._id === selectedStudent);
    const selectedCourseObj = courses.find((c) => c._id === selectedCourse);

    return (
        <>
            <Button className="cursor-pointer" onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Enrollment
            </Button>

            <Dialog
                open={open}
                onOpenChange={(val) => {
                    if (!val) handleClose();
                    else setOpen(true);
                }}
            >
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
                    <DialogHeader className="flex flex-col items-center gap-2 pb-2">
                        <DialogTitle className="text-xl font-bold tracking-widest uppercase">
                            Add New Enrollment
                        </DialogTitle>
                        <DialogDescription className="text-[#96999A] text-sm tracking-wide">
                            Enroll a student into a course
                        </DialogDescription>
                    </DialogHeader>

                    <Separator />

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">

                        {/* ─── Enrollment Details ─── */}
                        <div>
                            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
                                Enrollment Details
                            </p>
                            <div className="space-y-4">

                                {/* ── Student Combobox ── */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold tracking-widest uppercase">
                                        Student <span className="text-red-500">*</span>
                                    </Label>
                                    <Popover open={studentPopoverOpen} onOpenChange={setStudentPopoverOpen}>
                                        <PopoverTrigger>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={studentPopoverOpen}
                                                className={cn(
                                                    "w-full justify-between font-normal",
                                                    !selectedStudent && "text-muted-foreground"
                                                )}
                                            >
                                                {selectedStudentObj ? (
                                                    <span className="flex items-center gap-2 truncate">
                                                        <span>{selectedStudentObj.name}</span>
                                                        {selectedStudentObj.studentId && (
                                                            <span className="text-xs text-slate-400 font-mono">
                                                                ({selectedStudentObj.studentId})
                                                            </span>
                                                        )}
                                                    </span>
                                                ) : (
                                                    "Select a student"
                                                )}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Search student by name..." />
                                                <CommandList>
                                                    <CommandEmpty>No student found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {students.map((s) => (
                                                            <CommandItem
                                                                key={s._id}
                                                                value={`${s.name} ${s.studentId ?? ""}`} // searched against name + id
                                                                onSelect={() => {
                                                                    setSelectedStudent(s._id);
                                                                    setValue("student", s._id, { shouldValidate: true });
                                                                    setStudentPopoverOpen(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectedStudent === s._id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                <span>{s.name}</span>
                                                                {s.studentId && (
                                                                    <span className="ml-2 text-xs text-slate-400 font-mono">
                                                                        ({s.studentId})
                                                                    </span>
                                                                )}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {errors.student && (
                                        <p className="text-xs text-red-400">{errors.student.message}</p>
                                    )}
                                </div>

                                {/* ── Course Combobox ── */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold tracking-widest uppercase">
                                        Course <span className="text-red-500">*</span>
                                    </Label>
                                    <Popover open={coursePopoverOpen} onOpenChange={setCoursePopoverOpen}>
                                        <PopoverTrigger >
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={coursePopoverOpen}
                                                className={cn(
                                                    "w-full justify-between font-normal",
                                                    !selectedCourse && "text-muted-foreground"
                                                )}
                                            >
                                                {selectedCourseObj ? (
                                                    <span className="flex items-center gap-2 truncate">
                                                        <span>{selectedCourseObj.title}</span>
                                                        {selectedCourseObj.batch && (
                                                            <span className="text-xs text-slate-400">
                                                                ({selectedCourseObj.batch})
                                                            </span>
                                                        )}
                                                    </span>
                                                ) : (
                                                    "Select a course"
                                                )}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Search course by title..." />
                                                <CommandList>
                                                    <CommandEmpty>No course found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {courses.map((c) => (
                                                            <CommandItem
                                                                key={c._id}
                                                                value={`${c.title} ${c.batch ?? ""}`} // searched against title + batch
                                                                onSelect={() => {
                                                                    setSelectedCourse(c._id);
                                                                    setValue("course", c._id, { shouldValidate: true });
                                                                    setCoursePopoverOpen(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectedCourse === c._id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                <span>{c.title}</span>
                                                                {c.batch && (
                                                                    <span className="ml-2 text-xs text-slate-400">
                                                                        ({c.batch})
                                                                    </span>
                                                                )}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {errors.course && (
                                        <p className="text-xs text-red-400">{errors.course.message}</p>
                                    )}
                                </div>

                                {/* ── Status ── */}
                                {/* <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold tracking-widest uppercase">
                                        Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={selectedStatus}
                                        // onValueChange={(v) => {
                                        //   setSelectedStatus(v);
                                        //   setValue("status", v as any, { shouldValidate: true });
                                        // }}
                                        // onValueChange={(v) => setSelectedStatus(String(v))}
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
                                </div> */}

                            </div>
                        </div>

                        <Separator />

                        {/* ─── Payment Details ─── */}
                        <div>
                            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
                                Payment Details{" "}
                                <span className="text-[#96999A] normal-case font-normal">(optional)</span>
                            </p>
                            <div className="space-y-1.5">
                                <Label htmlFor="e-txn" className="text-xs font-semibold tracking-widest uppercase">
                                    Transaction ID
                                </Label>
                                <Input
                                    id="e-txn"
                                    placeholder="e.g. TXN-1234567890"
                                    {...register("transactionId")}
                                />
                                {errors.transactionId && (
                                    <p className="text-xs text-red-400">{errors.transactionId.message}</p>
                                )}
                            </div>
                        </div>

                        {/* ─── Submit ─── */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 cursor-pointer font-bold tracking-widest uppercase transition-colors disabled:opacity-60"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Creating...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Create Enrollment
                                </span>
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}