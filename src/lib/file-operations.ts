import fs from "fs";
import path from "path";

const blogDirectory = path.join(process.cwd(), "src/content/blog");
const projectDirectory = path.join(process.cwd(), "src/content/projects");

// Ensure blog directory exists
export function ensureBlogDirectory(): void {
  if (!fs.existsSync(blogDirectory)) {
    fs.mkdirSync(blogDirectory, { recursive: true });
  }
}

// Ensure project directory exists
export function ensureProjectDirectory(): void {
  if (!fs.existsSync(projectDirectory)) {
    fs.mkdirSync(projectDirectory, { recursive: true });
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

// Create a new project post file
export function createProjectPost(slug: string, content: string): boolean {
  try {
    ensureProjectDirectory();

    const filePath = path.join(projectDirectory, `${slug}.mdx`);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      throw new Error(`Project post with slug "${slug}" already exists`);
    }

    // Write the file
    fs.writeFileSync(filePath, content, "utf8");

    console.log(`Project post created: ${filePath}`);
    return true;
  } catch (error) {
    console.error("Error creating project post:", error);
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

// Update an existing project post
export function updateProjectPost(slug: string, content: string): boolean {
  try {
    const filePath = path.join(projectDirectory, `${slug}.mdx`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Project post with slug "${slug}" does not exist`);
    }

    // Write the file
    fs.writeFileSync(filePath, content, "utf8");

    console.log(`Project post updated: ${filePath}`);
    return true;
  } catch (error) {
    console.error("Error updating project post:", error);
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

// Delete a project post
export function deleteProjectPost(slug: string): boolean {
  try {
    const filePath = path.join(projectDirectory, `${slug}.mdx`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Project post with slug "${slug}" does not exist`);
    }

    // Delete the file
    fs.unlinkSync(filePath);

    console.log(`Project post deleted: ${filePath}`);
    return true;
  } catch (error) {
    console.error("Error deleting project post:", error);
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

// Get all project file names
export function getAllProjectFiles(): string[] {
  try {
    ensureProjectDirectory();
    const files = fs.readdirSync(projectDirectory);
    return files.filter((file) => file.endsWith(".mdx"));
  } catch (error) {
    console.error("Error reading project directory:", error);
    return [];
  }
}

// Check if blog post exists
export function blogPostExists(slug: string): boolean {
  const filePath = path.join(blogDirectory, `${slug}.mdx`);
  return fs.existsSync(filePath);
}

// Check if project post exists
export function projectPostExists(slug: string): boolean {
  const filePath = path.join(projectDirectory, `${slug}.mdx`);
  return fs.existsSync(filePath);
}

// Get raw content of a project post
export function getProjectRawContent(slug: string): string | null {
    try {
        const filePath = path.join(projectDirectory, `${slug}.mdx`);
        if (!fs.existsSync(filePath)) {
            return null;
        }
        const fileContents = fs.readFileSync(filePath, "utf8");
        // The raw content is the full file content, which includes the frontmatter
        return fileContents;
    } catch (error) {
        console.error(`Error reading raw content for project ${slug}:`, error);
        return null;
    }
}
