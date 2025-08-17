import { BackgroundCircles } from "@/components/background-circle";
import Blogs from "@/components/blogs";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Image from "next/image";

// proof of work page should be in the middle
export default function Home() {
  return (
    <div className="relative min-h-screen flex-col bg-white dark:bg-black">
      <Header />
      <BackgroundCircles title="Time is Reactive " variant="tertiary" />
      {/* <div className="relative z-10">
        <div className="h-[150vh]" />
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center">
            This is the content section
          </h2>
          <p className="text-center mt-4 mx-auto max-w-2xl">
            As you scroll, the background animation transforms. The circle moves
            to the top right and shrinks, resembling a sun. The text fades away,
            leaving just the animated sun. This provides a dynamic and engaging
            visual experience for the user.
          </p>
        </div>
        <div className="h-[150vh]" />
      </div> */}
      <Footer />
    </div>
  );
}
