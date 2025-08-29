import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// Fallback for different environments
const getProjectDirectory = () => {
  const possiblePaths = [
    path.join(process.cwd(), "src/content/projects"),
    path.join(process.cwd(), "content/projects"),
    path.join(__dirname, "../content/projects"),
  ];

  for (const dir of possiblePaths) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }

  return possiblePaths[0]; // Return default path
};

export interface ProjectPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  readTime: string;
  tags: string[];
  author?: string;
  featured?: boolean;
  liveLink?: string;
}

export interface ProjectMeta {
  title: string;
  slug: string;
  description: string;
  excerpt: string; // Added excerpt
  date: string;
  timeline?: string; // Added timeline
  isFeatured: boolean;
  tags: string[];
  githubLink?: string;
  liveLink?: string;
  pagePreviewLink?: string; // Added pagePreviewLink
}

// Calculate reading time based on content length
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Get all project posts metadata (for listing)
export async function getAllProjects(): Promise<ProjectMeta[]> {
  try {
    const actualProjectDirectory = getProjectDirectory();
    const fileNames = fs.readdirSync(actualProjectDirectory);

    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, "");
        const fullPath = path.join(actualProjectDirectory, fileName);
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
          liveLink: data.liveLink,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return allPostsData;
  } catch (error) {
    console.error("Error reading project directory:", error);
    return [];
  }
}

// Get a single project post by slug
export async function getProjectBySlug(
  slug: string
): Promise<ProjectPost | null> {
  try {
    const actualProjectDirectory = getProjectDirectory();
    const fullPath = path.join(actualProjectDirectory, `${slug}.mdx`);

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
      liveLink: data.liveLink,
    };
  } catch (error) {
    console.error(`Error reading project post ${slug}:`, error);
    return null;
  }
}

// Get all project slugs (for static generation)
export function getAllProjectSlugs(): string[] {
  try {
    const actualProjectDirectory = getProjectDirectory();
    const fileNames = fs.readdirSync(actualProjectDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map((fileName) => fileName.replace(/\.mdx$/, ""));
  } catch (error) {
    console.error("Error reading project slugs:", error);
    return [];
  }
}

// Get featured project posts
export async function getFeaturedProjects(): Promise<ProjectMeta[]> {
  const allProjects = await getAllProjects();
  return allProjects.filter((project) => project.featured);
}

// Get projects by tag
export async function getProjectsByTag(tag: string): Promise<ProjectMeta[]> {
  const allProjects = await getAllProjects();
  return allProjects.filter((project) => project.tags.includes(tag));
}
