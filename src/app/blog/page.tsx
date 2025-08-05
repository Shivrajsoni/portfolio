import { getAllBlogs } from "@/lib/blog-utils";
import Blogs from "@/components/blogs";

export default async function BlogPage() {
  try {
    const blogs = await getAllBlogs();
    return <Blogs initialBlogs={blogs || []} />;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return <Blogs initialBlogs={[]} />;
  }
}
