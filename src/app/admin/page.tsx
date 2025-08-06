"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Briefcase, Trophy, ArrowRight } from "lucide-react";

const dashboardItems = [
  {
    href: "/admin/blogs",
    icon: Book,
    title: "Blog Management",
    description: "Create, edit, and manage your blog posts.",
  },
  {
    href: "/admin/projects",
    icon: Briefcase,
    title: "Project Showcase",
    description: "Add and manage your portfolio projects.",
  },
  {
    href: "/admin/proof-of-work",
    icon: Trophy,
    title: "Proof of Work",
    description: "Showcase your achievements and certifications.",
  },
];

const stats = [
  { title: "Total Blogs", value: "2" },
  { title: "Total Projects", value: "0" },
  { title: "Certifications", value: "0" },
];

export default function AdminDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {dashboardItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={item.href}>
              <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold">
                    {item.title}
                  </CardTitle>
                  <item.icon className="w-6 h-6 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <div className="flex items-center text-primary hover:underline">
                    <span>Go to {item.title}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Quick Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
