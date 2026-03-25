import React from "react";
import {
  getProofOfWorkBySlug,
  getAllProofOfWorkSlugs,
} from "@/lib/proof-of-work-utils";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, CircleDot, Info } from "lucide-react";
import ProofOfWorkAmbient from "@/components/proof-of-work-ambient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const proofOfWork = await getProofOfWorkBySlug(slug);

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

const ProofOfWorkPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const proofOfWork = await getProofOfWorkBySlug(slug);

  if (!proofOfWork) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: proofOfWork.title,
    description: proofOfWork.excerpt,
    author: {
      "@type": "Person",
      name: "Shivraj Soni", // !TODO: Replace with your default author name
    },
    datePublished: proofOfWork.date,
  };

  const mergeStatus = proofOfWork.mergeStatus ?? null;
  const mergeBadge =
    mergeStatus === "merged" ? (
      <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-800 dark:text-indigo-300">
        <CheckCircle2 className="h-4 w-4" aria-hidden />
        Merged
      </div>
    ) : mergeStatus === "open" ? (
      <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-800 dark:text-sky-300">
        <CircleDot className="h-4 w-4" aria-hidden />
        Open
      </div>
    ) : (
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-500/10 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        <Info className="h-4 w-4" aria-hidden />
        In review
      </div>
    );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        key="pow-structured-data"
      />
      <ProofOfWorkAmbient>
        <div className="container mx-auto px-4 py-10 relative z-10">
          <Breadcrumb className="mb-10">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/proof-of-work">
                  Proof of Work
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{proofOfWork.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <article className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-[10px] p-6 sm:p-8 shadow-none">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                    {proofOfWork.title}
                  </h1>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span>{proofOfWork.date}</span>
                    <span aria-hidden>•</span>
                    <span>{proofOfWork.readTime}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {mergeBadge}
                  {proofOfWork.featured && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 px-4 py-2 text-sm font-medium">
                      <Star className="h-4 w-4" aria-hidden />
                      Featured
                    </div>
                  )}
                </div>
              </div>

              {proofOfWork.organization && (
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-white/80 border-none"
                  >
                    {proofOfWork.organization}
                  </Badge>
                </div>
              )}

              {proofOfWork.hardnessLevel && (
                <div className="mt-3">
                  <Badge
                    variant="secondary"
                    className="bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-white/80 border-none"
                  >
                    Hardness: {proofOfWork.hardnessLevel}
                  </Badge>
                </div>
              )}

              {proofOfWork.liveLink && (
                <div className="mt-6">
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
            </div>

            <div className="mt-10 prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: proofOfWork.content }} />
            </div>
          </article>
        </div>
      </ProofOfWorkAmbient>
    </>
  );
};

export default ProofOfWorkPage;
