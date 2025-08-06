import { BackgroundCircles } from "@/components/background-circle";
import Blogs from "@/components/blogs";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Image from "next/image";

// proof of work page should be in the middle
export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <BackgroundCircles
        title="Time is Reactive "
        description="Shivraj Soni "
        variant="tertiary"
        className="absolute inset-0 z-0"
      />

      <Footer />
    </div>
  );
}
