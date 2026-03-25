import React from "react";
import { getAllProofOfWork } from "@/lib/proof-of-work-utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProofOfWorkAmbient from "@/components/proof-of-work-ambient";
import ProofOfWorkCard from "@/components/proof-of-work-card";

const ProofOfWorkPage = async () => {
  const allProofOfWork = await getAllProofOfWork();

  return (
    <ProofOfWorkAmbient>
      <div className="container mx-auto py-12 px-4 relative z-10">
        <div className="rounded-3xl border border-slate-200/70 dark:border-white/10 bg-white/35 dark:bg-white/5 backdrop-blur-xl p-6 md:p-10">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Proof of Work</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <header className="mb-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Proof of Work
            </h1>
          </header>

          {allProofOfWork.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No proof of work entries found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {allProofOfWork.map((entry) => (
                <ProofOfWorkCard key={entry.slug} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProofOfWorkAmbient>
  );
};

export default ProofOfWorkPage;
