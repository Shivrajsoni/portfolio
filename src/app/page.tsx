import Footer from "@/components/footer";
import Header from "@/components/header";
import BackgroundCircles from "@/components/background-circles-client";
import Experience_Button from "@/components/experience_button";
import ExperienceSection from "@/components/experience_section";
import SongPlayer from "@/components/SongPlayer";
import { Keypad, BackgroundBeams } from "@/components/ui/macbook-scroll";

// proof of work page should be in the middle
export default function Home() {
  return (
    <div className="relative min-h-screen flex-col bg-white dark:bg-black">
      <Header />
      <BackgroundCircles />
      <div className="relative z-10">
        <div className="h-[60vh]" />
        <div className="container mx-auto px-4 py-16">
          <ExperienceSection />
        </div>
        <div className="relative w-full flex justify-center items-center my-16">
          <BackgroundBeams />
          <div className="transform scale-[0.8] sm:scale-100 md:scale-[1.35]">
            <Keypad />
          </div>
        </div>
      </div>
      <SongPlayer />
      <Footer />
    </div>
  );
}
