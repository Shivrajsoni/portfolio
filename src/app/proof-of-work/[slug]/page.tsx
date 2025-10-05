import React from "react";
import { getProofOfWorkBySlug, getAllProofOfWorkSlugs } from "@/lib/proof-of-work-utils";
import { notFound } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Metadata } from "next";

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const proofOfWork = await getProofOfWorkBySlug(params.slug);

  if (!proofOfWork) {
    return {
      title: "Proof of Work not found",
    };
  }

  return {
    title: proofOfWork.title,
    description: proofOfWork.excerpt,
    openGraph: {
      title: proofOfWork.title,
      description: proofOfWork.excerpt,
      type: "article",
      publishedTime: proofOfWork.date,
    },
    twitter: {
        card: "summary_large_image",
        title: proofOfWork.title,
        description: proofOfWork.excerpt,
    },
  };
}

export async function generateStaticParams() {
  const slugs = getAllProofOfWorkSlugs();
  return slugs.map((slug) => ({ slug }));
}

const ProofOfWorkPage = async ({ params }: { params: { slug: string } }) => {
  const proofOfWork = await getProofOfWorkBySlug(params.slug);

  if (!proofOfWork) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": proofOfWork.title,
    "description": proofOfWork.excerpt,
    "author": {
      "@type": "Person",
      "name": "Shivraj Soni" // !TODO: Replace with your default author name
    },
    "datePublished": proofOfWork.date,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        key="pow-structured-data"
      />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/proof-of-work">Proof of Work</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{proofOfWork.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <article className="prose dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-4">{proofOfWork.title}</h1>
          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <span>{proofOfWork.date}</span>
            <span className="mx-2">•</span>
            <span>{proofOfWork.readTime}</span>
          </div>
          {proofOfWork.liveLink && (
            <div className="mb-8">
              <a
                href={proofOfWork.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                View Live
              </a>
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: proofOfWork.content }} />
        </article>
      </div>
    </>
  );
};

export default ProofOfWorkPage;