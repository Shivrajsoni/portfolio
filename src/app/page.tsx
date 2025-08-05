import Blogs from "@/components/blogs";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Image from "next/image";

// proof of work page should be in the middle
export default function Home() {
  return (
    <div>
      <div className="flex flex-row">
        <Header />
      </div>
      <div className="flex flex-row">
        <Footer />
      </div>
    </div>
  );
}
