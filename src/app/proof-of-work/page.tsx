import React from "react";
import { getAllProofOfWork } from "@/lib/proof-of-work-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BeamsBackground from "@/components/beams-background";
import {
  GitPullRequest,
  Star,
  Calendar,
  Clock,
  Building,
  BarChart,
  Link,
  Award,
  Megaphone,
  CheckCircle2,
  CircleDot,
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const ProofOfWorkPage = async () => {
  const allProofOfWork = await getAllProofOfWork();

  return (
    <BeamsBackground intensity="subtle">
      <div className="container mx-auto py-12 px-4 relative z-10">
        <Breadcrumb className="mb-8">
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
        <h1 className="text-5xl font-bold text-center mb-16 text-white tracking-tighter">
          My Proof of Work
        </h1>
        {allProofOfWork.length === 0 ? (
          <p className="text-center text-white/70">
            No proof of work entries found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {allProofOfWork.map((entry) => {
              const typeIcon =
                entry.type === "bounty" ? (
                  <Award className="w-6 h-6 text-yellow-400" />
                ) : entry.type === "mentions" ? (
                  <Megaphone className="w-6 h-6 text-blue-400" />
                ) : (
                  <GitPullRequest className="w-6 h-6 text-green-400" />
                );
              return (
              <Card
                key={entry.slug}
                className="bg-white/5 border-white/10 text-white backdrop-blur-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    {entry.mergeStatus === "merged" ? (
                      <div className="flex items-center gap-1.5 text-purple-400 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>Merged</span>
                      </div>
                    ) : entry.mergeStatus === "open" ? (
                      <div className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
                        <CircleDot className="w-5 h-5 shrink-0" />
                        <span>Open</span>
                      </div>
                    ) : null}
                  </div>
                  <CardTitle className="text-2xl font-bold leading-tight flex items-center gap-2">
                    {typeIcon}
                    {entry.title}
                  </CardTitle>
                  <CardDescription className="text-white/60 pt-2">
                    {entry.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{entry.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{entry.readTime}</span>
                    </div>
                    {entry.organization && (
                      <div className="flex items-center gap-1.5">
                        <Building className="w-4 h-4" />
                        <span>{entry.organization}</span>
                      </div>
                    )}
                    {entry.hardnessLevel && (
                      <div className="flex items-center gap-1.5">
                        <BarChart className="w-4 h-4" />
                        <span>{entry.hardnessLevel}</span>
                      </div>
                    )}
                  </div>
                  {entry.featured && (
                    <div className="flex items-center gap-1.5 text-yellow-400 font-medium mb-4">
                      <Star className="w-4 h-4" />
                      <span>Featured</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-white/10 text-white/80 border-none"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {entry.liveLink && (
                    <a
                      href={entry.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1.5"
                    >
                      <span><Link className="w-4 h-4" /></span>
                      <span>Live Preview</span>
                    </a>
                  )}
                </CardFooter>
              </Card>
              );
            })}
          </div>
        )}
      </div>
    </BeamsBackground>
  );
};

export default ProofOfWorkPage;
