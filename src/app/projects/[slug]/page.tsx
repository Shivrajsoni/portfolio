import ProjectPage from "@/components/project-page";
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/project-utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: project.title,
    description: project.excerpt,
    openGraph: {
      title: project.title,
      description: project.excerpt,
      type: "article",
      publishedTime: project.date,
      authors: project.author ? [project.author] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.excerpt,
    },
  };
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.excerpt,
    author: {
      "@type": "Person",
      name: project.author || "Shivraj Soni",
    },
    datePublished: project.date,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        key="project-structured-data"
      />
      <ProjectPage project={project} />
    </>
  );
};

export default Page;
