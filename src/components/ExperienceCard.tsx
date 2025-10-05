"use client";

import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const experiences = [
  {
    company: "Innovate Inc.",
    role: "Lead Frontend Developer",
    duration: "2021 - Present",
    description: "Spearheaded the development of a new design system and led the migration of the main application to Next.js.",
    techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Figma"],
  },
  {
    company: "Creative Solutions",
    role: "UI/UX Designer",
    duration: "2019 - 2021",
    description: "Designed and prototyped user interfaces for various client projects, focusing on usability and modern design principles.",
    techStack: ["Figma", "Sketch", "Adobe XD", "UserTesting"],
  },
  {
    company: "Tech Corp",
    role: "Senior Software Engineer",
    duration: "2020 - Present",
    description: "Leading the development of a new cloud-native platform, focusing on scalability and performance.",
    techStack: ["React", "Node.js", "TypeScript", "Kubernetes", "AWS"],
  },
  {
    company: "Innovate LLC",
    role: "Frontend Developer",
    duration: "2018 - 2020",
    description: "Developed and maintained the company's main web application, improving user experience and performance.",
    techStack: ["Vue.js", "JavaScript", "CSS3", "HTML5", "Webpack"],
  },
];

const ExperienceCard = () => {
  return (
    <InfiniteMovingCards items={experiences} />
  )
}

export default ExperienceCard;
