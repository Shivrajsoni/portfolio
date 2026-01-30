import BlogPage from "@/components/blog-page";
import { getAllBlogSlugs, getBlogBySlug } from "@/lib/blog-utils";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog post not found",
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.date,
      authors: blog.author ? [blog.author] : [],
    },
    twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.excerpt,
    },
  };
}


export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return <div>Blog not found</div>;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "datePublished": blog.date,
    "author": {
      "@type": "Person",
      "name": blog.author || "Shivraj Soni" // !TODO: Replace with your default author name
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        key="blog-structured-data"
      />
      <BlogPage blog={blog} />
    </>
  );
};

export default Page;