import React from "react";
import { getProofOfWorkBySlug, getAllProofOfWorkSlugs } from "@/lib/proof-of-work-utils";
import { notFound } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export async function generateStaticParams() {
  const slugs = getAllProofOfWorkSlugs();
  return slugs.map((slug) => ({ slug }));
}

const ProofOfWorkPage = async ({ params }: { params: { slug: string } }) => {
  const proofOfWork = await getProofOfWorkBySlug(params.slug);

  if (!proofOfWork) {
    notFound();
  }

  return (
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
  );
};

export default ProofOfWorkPage;
