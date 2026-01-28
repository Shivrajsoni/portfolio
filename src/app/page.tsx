import Footer from "@/components/footer";
import Header from "@/components/header";
import HeroAndProfileWrapper from "@/components/hero-and-profile-wrapper";
import ScrollSection from "@/components/scroll-section";
import { getFeaturedBlogs } from "@/lib/blog-utils";
import { getFeaturedProjects } from "@/lib/project-utils";
import { getFeaturedProofOfWork } from "@/lib/proof-of-work-utils";

export default async function Home() {
  const [featuredBlogs, featuredProjects, featuredProofOfWork] =
    await Promise.all([
      getFeaturedBlogs(),
      getFeaturedProjects(),
      getFeaturedProofOfWork(),
    ]);

  return (
    <div className="relative min-h-screen flex-col bg-white dark:bg-black">
      <Header />
      <HeroAndProfileWrapper
        featuredBlogs={featuredBlogs}
        featuredProjects={featuredProjects}
        featuredProofOfWork={featuredProofOfWork}
      >
        {/* <ScrollSection
          title="Build for AI Agents"
          subtitle="Create powerful AI agents that transform how you work and automate complex tasks"
          cards={[]}
        /> */}
      </HeroAndProfileWrapper>

      <Footer />
    </div>
  );
}
