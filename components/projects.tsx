
import React from "react";
import SectionHeading from "./section-heading.tsx";
import { projectsData } from "../lib/data.ts";
import Project from "./project.tsx";
export default function Projects() {
  return (
    <section className ="scroll-mt-28 mb-28">
    <SectionHeading>My Projects</SectionHeading>
      <div>
        {projectsData.map((project,index)=>(
      
        <React.Fragment key = {index}>
          <Project {...project}/>
        </React.Fragment>

       ))}
      </div>
    </section>
  )
}


