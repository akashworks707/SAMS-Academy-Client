import CoursesSection from "@/components/public-modules/home/courseSection";
import HeroSection from "@/components/public-modules/home/heroSection";
import TeachersSection from "@/components/public-modules/home/teacherSection";


export default function Home() {
  return (
    <div >
      <HeroSection />
      <CoursesSection />
      <TeachersSection />
    </div>
  );
}
