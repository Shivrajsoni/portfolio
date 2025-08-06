import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// Fallback for different environments
const getProofOfWorkDirectory = () => {
  const possiblePaths = [
    path.join(process.cwd(), "src/content/proofofwork"),
    path.join(process.cwd(), "content/proofofwork"),
    path.join(__dirname, "../content/proofofwork"),
  ];

  for (const dir of possiblePaths) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }

  // Ensure the directory exists if it's the primary path
  const defaultPath = possiblePaths[0];
  if (!fs.existsSync(defaultPath)) {
    fs.mkdirSync(defaultPath, { recursive: true });
  }
  return defaultPath;
};

export interface ProofOfWorkPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  readTime: string;
  tags: string[];
  liveLink?: string;
  organization?: string;
  hardnessLevel?: string;
  featured?: boolean;
}

export interface ProofOfWorkMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  tags: string[];
  liveLink?: string;
  organization?: string;
  hardnessLevel?: string;
  featured?: boolean;
}

// Calculate reading time based on content length
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Get all proof of work metadata (for listing)
export async function getAllProofOfWork(): Promise<ProofOfWorkMeta[]> {
  const actualProofOfWorkDirectory = getProofOfWorkDirectory();
  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(actualProofOfWorkDirectory);
  } catch (error) {
    console.error("Error reading proof of work directory:", error);
    throw new Error("Failed to read proof of work directory.");
  }

  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(actualProofOfWorkDirectory, fileName);
      let fileContents: string;
      try {
        fileContents = fs.readFileSync(fullPath, "utf8");
      } catch (readError) {
        console.warn(`Could not read file ${fileName}:`, readError);
        return null;
      }
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString().split("T")[0],
        excerpt: data.excerpt || content.slice(0, 150) + "...",
        readTime: calculateReadTime(content),
        tags: data.tags || [],
        liveLink: data.liveLink,
        organization: data.organization,
        hardnessLevel: data.hardnessLevel,
        featured: data.featured || false,
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ) as ProofOfWorkMeta[];

  return allPostsData;
}

// Get a single proof of work by slug
export async function getProofOfWorkBySlug(
  slug: string
): Promise<ProofOfWorkPost | null> {
  const actualProofOfWorkDirectory = getProofOfWorkDirectory();
  const fullPath = path.join(actualProofOfWorkDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null; // Return null if not found, consistent with previous behavior
  }

  let fileContents: string;
  try {
    fileContents = fs.readFileSync(fullPath, "utf8");
  } catch (error) {
    console.error(`Error reading proof of work post ${slug}:`, error);
    throw new Error(`Failed to read proof of work post ${slug}.`);
  }

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
    liveLink: data.liveLink,
    organization: data.organization,
    hardnessLevel: data.hardnessLevel,
    featured: data.featured || false,
  };
}

// Get all proof of work slugs (for static generation)
export function getAllProofOfWorkSlugs(): string[] {
  const actualProofOfWorkDirectory = getProofOfWorkDirectory();
  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(actualProofOfWorkDirectory);
  } catch (error) {
    console.error("Error reading proof of work slugs:", error);
    throw new Error("Failed to read proof of work slugs.");
  }
  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
}

// Create a new proof of work MDX file
export async function createProofOfWork(
  data: Omit<ProofOfWorkPost, "slug" | "readTime" | "content"> & {
    content: string;
  }
): Promise<ProofOfWorkMeta> {
  const actualProofOfWorkDirectory = getProofOfWorkDirectory();
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const fullPath = path.join(actualProofOfWorkDirectory, `${slug}.mdx`);

  if (fs.existsSync(fullPath)) {
    throw new Error(`Proof of Work with slug "${slug}" already exists.`);
  }

  const frontMatter = {
    title: data.title,
    date: data.date || new Date().toISOString().split("T")[0],
    excerpt: data.excerpt,
    tags: data.tags,
    liveLink: data.liveLink || null,
    organization: data.organization || null,
    hardnessLevel: data.hardnessLevel || null,
    featured: data.featured || false,
  };

  const fileContent = matter.stringify(data.content, frontMatter);
  try {
    fs.writeFileSync(fullPath, fileContent);
  } catch (error) {
    console.error(`Error writing proof of work file ${slug}.mdx:`, error);
    throw new Error(`Failed to create proof of work file ${slug}.`);
  }

  return {
    slug,
    ...frontMatter,
    readTime: calculateReadTime(data.content),
  };
}

// Update an existing proof of work MDX file
export async function updateProofOfWork(
  slug: string,
  data: Omit<ProofOfWorkPost, "slug" | "readTime" | "content"> & {
    content: string;
  }
): Promise<ProofOfWorkMeta> {
  const actualProofOfWorkDirectory = getProofOfWorkDirectory();
  const fullPath = path.join(actualProofOfWorkDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Proof of Work with slug "${slug}" not found.`);
  }

  const frontMatter = {
    title: data.title,
    date: data.date || new Date().toISOString().split("T")[0],
    excerpt: data.excerpt,
    tags: data.tags,
    liveLink: data.liveLink || null,
    organization: data.organization || null,
    hardnessLevel: data.hardnessLevel || null,
    featured: data.featured || false,
  };

  const fileContent = matter.stringify(data.content, frontMatter);
  try {
    fs.writeFileSync(fullPath, fileContent);
  } catch (error) {
    console.error(`Error writing proof of work file ${slug}.mdx:`, error);
    throw new Error(`Failed to update proof of work file ${slug}.`);
  }

  return {
    slug,
    ...frontMatter,
    readTime: calculateReadTime(data.content),
  };
}

// Delete a proof of work MDX file
export function deleteProofOfWork(slug: string): void {
  const actualProofOfWorkDirectory = getProofOfWorkDirectory();
  const fullPath = path.join(actualProofOfWorkDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Proof of Work with slug "${slug}" not found.`);
  }

  try {
    fs.unlinkSync(fullPath);
  } catch (error) {
    console.error(`Error deleting proof of work file ${slug}.mdx:`, error);
    throw new Error(`Failed to delete proof of work file ${slug}.`);
  }
}
