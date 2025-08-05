import Footer from "@/components/footer";
import Header from "@/components/header";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="flex flex-row">
        <Header />
      </div>
      //// Body part
      <div className="flex flex-row">Main Page </div>
      <div className="flex flex-row">
        <Footer />
      </div>
    </div>
  );
}
