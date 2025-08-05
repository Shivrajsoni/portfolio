import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

//const blogDirectory = path.join(process.cwd(), "src/content/blog");

// Fallback for different environments
const getBlogDirectory = () => {
  const possiblePaths = [
    path.join(process.cwd(), "src/content/blog"),
    path.join(process.cwd(), "content/blog"),
    path.join(__dirname, "../content/blog"),
  ];

  for (const dir of possiblePaths) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }

  return possiblePaths[0]; // Return default path
};

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  readTime: string;
  tags: string[];
  author?: string;
  featured?: boolean;
}

export interface BlogMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  tags: string[];
  author?: string;
  featured?: boolean;
}

// Calculate reading time based on content length
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Get all blog posts metadata (for listing)
export async function getAllBlogs(): Promise<BlogMeta[]> {
  try {
    const actualBlogDirectory = getBlogDirectory();
    // console.log("Blog directory path:", actualBlogDirectory);
    const fileNames = fs.readdirSync(actualBlogDirectory);
    //console.log("Found files:", fileNames);

    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, "");
        const fullPath = path.join(actualBlogDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || "Untitled",
          date: data.date || new Date().toISOString().split("T")[0],
          excerpt: data.excerpt || content.slice(0, 150) + "...",
          readTime: calculateReadTime(content),
          tags: data.tags || [],
          author: data.author,
          featured: data.featured || false,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return allPostsData;
  } catch (error) {
    console.error("Error reading blog directory:", error);
    return [];
  }
}

// Get a single blog post by slug
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const actualBlogDirectory = getBlogDirectory();
    const fullPath = path.join(actualBlogDirectory, `${slug}.mdx`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Convert markdown to HTML
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString().split("T")[0],
      excerpt: data.excerpt || content.slice(0, 150) + "...",
      content: contentHtml,
      readTime: calculateReadTime(content),
      tags: data.tags || [],
      author: data.author,
      featured: data.featured || false,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

// Get all blog slugs (for static generation)
export function getAllBlogSlugs(): string[] {
  try {
    const actualBlogDirectory = getBlogDirectory();
    const fileNames = fs.readdirSync(actualBlogDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map((fileName) => fileName.replace(/\.mdx$/, ""));
  } catch (error) {
    console.error("Error reading blog slugs:", error);
    return [];
  }
}

// Get featured blog posts
export async function getFeaturedBlogs(): Promise<BlogMeta[]> {
  const allBlogs = await getAllBlogs();
  return allBlogs.filter((blog) => blog.featured);
}

// Get blogs by tag
export async function getBlogsByTag(tag: string): Promise<BlogMeta[]> {
  const allBlogs = await getAllBlogs();
  return allBlogs.filter((blog) => blog.tags.includes(tag));
}
