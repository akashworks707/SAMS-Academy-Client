import TeacherDashboard from "@/components/dashboard/DasboardOverviewForTeacher";
import { useUser } from "@/context/UserContext";

export default function DashboardPage() {


// const { user, logout } = useUser();

// console.log("user", user)

const prop = {
teacherId: "6a12b97dcb7e2ccd58f98b11",
teacherName: "Rafi"
}


  return <TeacherDashboard />;
}
