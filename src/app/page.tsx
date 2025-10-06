import Footer from "@/components/footer";
import Header from "@/components/header";
import BackgroundCircles from "@/components/background-circles-client";
import Experience_Button from "@/components/experience_button";
import ExperienceSection from "@/components/experience_section";
import SongPlayer from "@/components/SongPlayer";

// proof of work page should be in the middle
export default function Home() {
  return (
    <div className="relative min-h-screen flex-col bg-white dark:bg-black">
      <Header />
      <BackgroundCircles title="Time is Reactive " variant="tertiary" />
      <div className="relative z-10">
        <div className="h-[100vh]" />
        <div className="container mx-auto px-4 py-16">
          <ExperienceSection />
        </div>
        <div className="h-[60vh]" />
      </div>
      <SongPlayer />
      <Footer />
    </div>
  );
}
