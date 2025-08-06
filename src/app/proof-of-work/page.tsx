import React from "react";
import { getAllProofOfWork } from "@/lib/proof-of-work-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const ProofOfWorkPage = async () => {
  const allProofOfWork = await getAllProofOfWork();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">My Proof of Work</h1>
      {allProofOfWork.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No proof of work entries found.
        </p>
      ) : (
        <div className="space-y-8">
          {allProofOfWork.map((entry) => (
            <Card
              key={entry.slug}
              className="w-full hover:shadow-lg transition-shadow duration-200 ease-in-out"
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold leading-tight">
                  {entry.liveLink ? (
                    <a
                      href={entry.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {entry.title}
                    </a>
                  ) : (
                    entry.title
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{entry.excerpt}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mb-4">
                  <span>{entry.date}</span>
                  <span>•</span>
                  <span>{entry.readTime}</span>
                  {entry.organization && (
                    <>
                      <span>•</span>
                      <span>{entry.organization}</span>
                    </>
                  )}
                  {entry.hardnessLevel && (
                    <>
                      <span>•</span>
                      <span>{entry.hardnessLevel}</span>
                    </>
                  )}
                  {entry.featured && (
                    <>
                      <span>•</span>
                      <span className="text-primary font-medium">Featured</span>
                    </>
                  )}
                </div>
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProofOfWorkPage;
