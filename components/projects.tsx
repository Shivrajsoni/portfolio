"use client";

import React,{useEffect} from "react";
import SectionHeading from "./section-heading.tsx";
import { projectsData } from "../lib/data.ts";
import Project from "./project.tsx";
import {useSectionInView} from "../lib/hook.ts";

export default function Projects() {
  const { ref } = useSectionInView("Projects");

  return (
    <section ref = {ref} id ="projects" className ="scroll-mt-28 mb-28">
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


