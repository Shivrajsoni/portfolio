import { MetadataRoute } from 'next'
import { getAllBlogSlugs } from '@/lib/blog-utils';
import { getAllProjectSlugs } from '@/lib/project-utils';
import { getAllProofOfWorkSlugs } from '@/lib/proof-of-work-utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://shivrajsoni.com"; // !TODO: Replace with your domain

  const blogUrls = getAllBlogSlugs().map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
  }));

  const projectUrls = getAllProjectSlugs().map(slug => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
  }));

  const proofOfWorkUrls = getAllProofOfWorkSlugs().map(slug => ({
    url: `${baseUrl}/proof-of-work/${slug}`,
    lastModified: new Date(),
  }));

  const staticUrls = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    { url: `${baseUrl}/projects`, lastModified: new Date() },
    { url: `${baseUrl}/proof-of-work`, lastModified: new Date() },
  ];

  return [...staticUrls, ...blogUrls, ...projectUrls, ...proofOfWorkUrls];
}
