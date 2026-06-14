import HeroSection from "@/components/public-modules/home/heroSection";
import { OurTeachersSection } from "@/components/public-modules/home/HomeSections";
import { OurCoursesSection } from "@/components/public-modules/home/OurCoursesSection";


export default function Home() {
  return (
    <div >
      <HeroSection />
      <OurCoursesSection />
      <OurTeachersSection />
    </div>
  );
}
