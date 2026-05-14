import {
  dummyStudents,
  dummyTeachers,
  dummyClasses,
  dummySubjects,
  dummyPayments,
  dummyCommissions,
  getDashboardStats,
} from "@/lib/dummy-data";
import type {
  Student,
  Teacher,
  Class,
  Subject,
  Payment,
  Commission,
} from "@/types";
import { initializeDataFromStorage, persistToStorage } from "./storage-service";

// In-memory cache for students (initialized from localStorage or dummy data)
const studentsCache = initializeDataFromStorage<Student>(
  "students",
  dummyStudents,
);

// Student Service with localStorage persistence
export const StudentService = {
  getAll: async (): Promise<Student[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...studentsCache]), 100);
    });
  },

  getById: async (id: string): Promise<Student | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(studentsCache.find((s) => s.id === id)), 100);
    });
  },

  create: async (student: Omit<Student, "id">): Promise<Student> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newStudent: Student = {
          ...student,
          id: `STU${Date.now()}`,
        };
        studentsCache.push(newStudent);
        persistToStorage("students", studentsCache);
        resolve(newStudent);
      }, 100);
    });
  },

  update: async (
    id: string,
    student: Partial<Student>,
  ): Promise<Student | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = studentsCache.findIndex((s) => s.id === id);
        if (index === -1) {
          resolve(undefined);
          return;
        }
        const updated = { ...studentsCache[index], ...student };
        studentsCache[index] = updated;
        persistToStorage("students", studentsCache);
        resolve(updated);
      }, 100);
    });
  },

  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = studentsCache.findIndex((s) => s.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        studentsCache.splice(index, 1);
        persistToStorage("students", studentsCache);
        resolve(true);
      }, 100);
    });
  },
};

// In-memory cache for teachers
const teachersCache = initializeDataFromStorage<Teacher>(
  "teachers",
  dummyTeachers,
);

// Teacher Service with localStorage persistence
export const TeacherService = {
  getAll: async (): Promise<Teacher[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...teachersCache]), 100);
    });
  },

  getById: async (id: string): Promise<Teacher | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(teachersCache.find((t) => t.id === id)), 100);
    });
  },

  create: async (teacher: Omit<Teacher, "id">): Promise<Teacher> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTeacher: Teacher = {
          ...teacher,
          id: `TCH${Date.now()}`,
        };
        teachersCache.push(newTeacher);
        persistToStorage("teachers", teachersCache);
        resolve(newTeacher);
      }, 100);
    });
  },

  update: async (
    id: string,
    teacher: Partial<Teacher>,
  ): Promise<Teacher | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = teachersCache.findIndex((t) => t.id === id);
        if (index === -1) {
          resolve(undefined);
          return;
        }
        const updated = { ...teachersCache[index], ...teacher };
        teachersCache[index] = updated;
        persistToStorage("teachers", teachersCache);
        resolve(updated);
      }, 100);
    });
  },

  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = teachersCache.findIndex((t) => t.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        teachersCache.splice(index, 1);
        persistToStorage("teachers", teachersCache);
        resolve(true);
      }, 100);
    });
  },
};

// In-memory cache for classes
const classesCache = initializeDataFromStorage<Class>("classes", dummyClasses);

// Class Service with localStorage persistence
export const ClassService = {
  getAll: async (): Promise<Class[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...classesCache]), 100);
    });
  },

  getById: async (id: string): Promise<Class | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(classesCache.find((c) => c.id === id)), 100);
    });
  },

  create: async (classData: Omit<Class, "id">): Promise<Class> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newClass: Class = {
          ...classData,
          id: `CLS${Date.now()}`,
        };
        classesCache.push(newClass);
        persistToStorage("classes", classesCache);
        resolve(newClass);
      }, 100);
    });
  },

  update: async (
    id: string,
    classData: Partial<Class>,
  ): Promise<Class | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = classesCache.findIndex((c) => c.id === id);
        if (index === -1) {
          resolve(undefined);
          return;
        }
        const updated = { ...classesCache[index], ...classData };
        classesCache[index] = updated;
        persistToStorage("classes", classesCache);
        resolve(updated);
      }, 100);
    });
  },

  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = classesCache.findIndex((c) => c.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        classesCache.splice(index, 1);
        persistToStorage("classes", classesCache);
        resolve(true);
      }, 100);
    });
  },
};

// In-memory cache for subjects
const subjectsCache = initializeDataFromStorage<Subject>(
  "subjects",
  dummySubjects,
);

// Subject Service with localStorage persistence
export const SubjectService = {
  getAll: async (): Promise<Subject[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...subjectsCache]), 100);
    });
  },

  getById: async (id: string): Promise<Subject | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(subjectsCache.find((s) => s.id === id)), 100);
    });
  },

  create: async (subject: Omit<Subject, "id">): Promise<Subject> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSubject: Subject = {
          ...subject,
          id: `SUB${Date.now()}`,
        };
        subjectsCache.push(newSubject);
        persistToStorage("subjects", subjectsCache);
        resolve(newSubject);
      }, 100);
    });
  },

  update: async (
    id: string,
    subject: Partial<Subject>,
  ): Promise<Subject | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = subjectsCache.findIndex((s) => s.id === id);
        if (index === -1) {
          resolve(undefined);
          return;
        }
        const updated = { ...subjectsCache[index], ...subject };
        subjectsCache[index] = updated;
        persistToStorage("subjects", subjectsCache);
        resolve(updated);
      }, 100);
    });
  },

  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = subjectsCache.findIndex((s) => s.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        subjectsCache.splice(index, 1);
        persistToStorage("subjects", subjectsCache);
        resolve(true);
      }, 100);
    });
  },
};

// In-memory cache for payments
const paymentsCache = initializeDataFromStorage<Payment>(
  "payments",
  dummyPayments,
);

// Payment Service with localStorage persistence
export const PaymentService = {
  getAll: async (): Promise<Payment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...paymentsCache]), 100);
    });
  },

  getById: async (id: string): Promise<Payment | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(paymentsCache.find((p) => p.id === id)), 100);
    });
  },

  create: async (payment: Omit<Payment, "id">): Promise<Payment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPayment: Payment = {
          ...payment,
          id: `PAY${Date.now()}`,
        };
        paymentsCache.push(newPayment);
        persistToStorage("payments", paymentsCache);
        resolve(newPayment);
      }, 100);
    });
  },

  update: async (
    id: string,
    payment: Partial<Payment>,
  ): Promise<Payment | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = paymentsCache.findIndex((p) => p.id === id);
        if (index === -1) {
          resolve(undefined);
          return;
        }
        const updated = { ...paymentsCache[index], ...payment };
        paymentsCache[index] = updated;
        persistToStorage("payments", paymentsCache);
        resolve(updated);
      }, 100);
    });
  },

  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = paymentsCache.findIndex((p) => p.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        paymentsCache.splice(index, 1);
        persistToStorage("payments", paymentsCache);
        resolve(true);
      }, 100);
    });
  },
};

// In-memory cache for commissions
const commissionsCache = initializeDataFromStorage<Commission>(
  "commissions",
  dummyCommissions,
);

// Commission Service with localStorage persistence
export const CommissionService = {
  getAll: async (): Promise<Commission[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...commissionsCache]), 100);
    });
  },

  getById: async (id: string): Promise<Commission | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(commissionsCache.find((c) => c.id === id)), 100);
    });
  },

  create: async (commission: Omit<Commission, "id">): Promise<Commission> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCommission: Commission = {
          ...commission,
          id: `COM${Date.now()}`,
        };
        commissionsCache.push(newCommission);
        persistToStorage("commissions", commissionsCache);
        resolve(newCommission);
      }, 100);
    });
  },

  update: async (
    id: string,
    commission: Partial<Commission>,
  ): Promise<Commission | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = commissionsCache.findIndex((c) => c.id === id);
        if (index === -1) {
          resolve(undefined);
          return;
        }
        const updated = { ...commissionsCache[index], ...commission };
        commissionsCache[index] = updated;
        persistToStorage("commissions", commissionsCache);
        resolve(updated);
      }, 100);
    });
  },

  delete: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = commissionsCache.findIndex((c) => c.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        commissionsCache.splice(index, 1);
        persistToStorage("commissions", commissionsCache);
        resolve(true);
      }, 100);
    });
  },
};

// Dashboard Service
export const DashboardService = {
  getStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getDashboardStats()), 100);
    });
  },
};
