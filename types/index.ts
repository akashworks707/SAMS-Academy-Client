export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  enrollmentDate: string;
  status: "active" | "inactive";
  avatar?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  classes: string[];
  joinDate: string;
  status: "active" | "inactive";
  avatar?: string;
}

export interface IResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
}

export interface Class {
  id: string;
  name: string;
  code: string;
  classTeacher: string;
  totalStudents: number;
  totalCapacity: number;
  status: "active" | "inactive";
  semester: string;
  grade: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  creditHours: number;
  classes: string[];
  status: "active" | "inactive";
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  type: "tuition" | "activity" | "other";
}

export interface Commission {
  id: string;
  name: string;
  totalSales: number;
  amount: number;
  date: string;
  status: "active" | "pending" | "inactive";
  commissionRate: number;
}

export interface StatCard {
  id: string;
  title: string;
  value: number;
  icon: string;
  trend: number;
  trendDirection: "up" | "down" | "neutral";
  color: string;
  description?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  totalTeachers: number;
  totalSubjects: number;
  totalPayments: number;
  totalCommission: number;
  studentTrend: number;
  classTrend: number;
  teacherTrend: number;
  subjectTrend: number;
  paymentTrend: number;
  commissionTrend: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  name?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  avatar?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}
export enum Role {
    ADMIN = "ADMIN",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT",
}

export interface IAddress {
    division?: string;
    district?: string;
    thana?: string;
    union?: string;
}

export interface IUser {
    _id?: string;

    // common
    name: string;
    email: string;
    password: string;
    picture?: string;
    phone: string;
    role: Role;
    isDeleted: boolean;
    isActive: boolean;

    // address
    address?: IAddress;

    // teacher fields
    qualification?: string;
    experience?: number;
    designation?: string;
    salary?: number;
    perClassSalary?: number;
    bio?: string;

    // student fields
    studentId?: string;
    section?: string;
    roll?: number;
    guardianName?: string;
    guardianPhone?: string;
    dateOfBirth?: Date;
}