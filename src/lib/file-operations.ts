import fs from "fs";
import path from "path";

const blogDirectory = path.join(process.cwd(), "src/content/blog");

// Ensure blog directory exists
export function ensureBlogDirectory(): void {
  if (!fs.existsSync(blogDirectory)) {
    fs.mkdirSync(blogDirectory, { recursive: true });
  }
}

// Create a new blog post file
export function createBlogPost(slug: string, content: string): boolean {
  try {
    ensureBlogDirectory();

    const filePath = path.join(blogDirectory, `${slug}.mdx`);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      throw new Error(`Blog post with slug "${slug}" already exists`);
    }

    // Write the file
    fs.writeFileSync(filePath, content, "utf8");

    console.log(`Blog post created: ${filePath}`);
    return true;
  } catch (error) {
    console.error("Error creating blog post:", error);
    return false;
  }
}

// Update an existing blog post
export function updateBlogPost(slug: string, content: string): boolean {
  try {
    const filePath = path.join(blogDirectory, `${slug}.mdx`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Blog post with slug "${slug}" does not exist`);
    }

    // Write the file
    fs.writeFileSync(filePath, content, "utf8");

    console.log(`Blog post updated: ${filePath}`);
    return true;
  } catch (error) {
    console.error("Error updating blog post:", error);
    return false;
  }
}

// Delete a blog post
export function deleteBlogPost(slug: string): boolean {
  try {
    const filePath = path.join(blogDirectory, `${slug}.mdx`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Blog post with slug "${slug}" does not exist`);
    }

    // Delete the file
    fs.unlinkSync(filePath);

    console.log(`Blog post deleted: ${filePath}`);
    return true;
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return false;
  }
}

// Get all blog file names
export function getAllBlogFiles(): string[] {
  try {
    ensureBlogDirectory();
    const files = fs.readdirSync(blogDirectory);
    return files.filter((file) => file.endsWith(".mdx"));
  } catch (error) {
    console.error("Error reading blog directory:", error);
    return [];
  }
}

// Check if blog post exists
export function blogPostExists(slug: string): boolean {
  const filePath = path.join(blogDirectory, `${slug}.mdx`);
  return fs.existsSync(filePath);
}
