import { getAllProjectSlugs, getProjectBySlug } from "@/lib/project-utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: { slug: string }
}

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
    "name": project.title,
    "description": project.excerpt,
    "author": {
      "@type": "Person",
      "name": project.author || "Shivraj Soni" // !TODO: Replace with your default author name
    },
    "datePublished": project.date,
  };

  return (
    <article className="prose prose-zinc mx-auto min-h-screen max-w-4xl p-8 dark:prose-invert">
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            key="project-structured-data"
        />
      <h1 className="mb-2 text-3xl font-bold">{project.title}</h1>
      <p className="text-sm text-zinc-400">
        {new Date(project.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <div
        className="mt-8"
        dangerouslySetInnerHTML={{ __html: project.content }}
      />
    </article>
  );
};

export default Page;