"use client";

import React, { useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { FaGithubSquare } from "react-icons/fa";
import useActiveSection from "../context/use-active-state"
import { useSectionInView } from "../lib/hook";




function Intro() {

  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveState, setLastTimeClick } = useActiveSection();

  return (
    <section ref={ref} id="home" className="mb-28 max-w-[50rem] text-center sm:mb-0 scroll-mt-[100rem]">
      <div className="flex justify-center items-center">
        <div className="relative ">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "tween",
              duration: 0.3,
            }}
          >
            <Image src="https://github.com/Shivrajsoni.png" alt="github image" height="192" width="192" quality="92" className="h-24 w-24 rounded-full object-cover border-[0.35rem] border-white shadow-xl" priority={true} />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 125,
              delay: 0.1,
              duration: 0.75
            }}
            className="absolute bottom-0 right-0 text-4xl">👽</motion.span>
        </div>
      </div>
      <motion.h1
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "tween",
          duration: 0.3,
        }}
        className="mb-10 mt-4 px-4 text-2xl font-medium !leading-[1.5] sm:text-4xl">
        <span className="font-bold">Hello, I'm Shivraj Soni.</span> I'm a{" "}
        <span className="font-bold">full-stack developer</span> with{" "}
        <span className="font-bold">0 years</span> of experience. I enjoy
        building <span className="italic">sites & apps</span>. My focus is{" "}
        <span className="underline">React (Next.js)</span>.
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "tween",
          duration: 0.3,
        }}

        className="flex flex-col sm:flex-row items-center justify-center gap-2 px-4 text-lg font-medium">
        <Link className="group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition" href="#contact" onClick={() => { setActiveState("Contact"); setLastTimeClick(Date.now()) }}>contact me here {" "} <BsArrowRight className="opacity-70 group-hover:translate-x-1 transition" /></Link>
        <a href="/CV.pdf" className="group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10" download >Download CV {" "}  <HiDownload className="opacity-60 group-hover:translate-y-1 transition" /></a>
        <a className="bg-white p-4 text-gray-700 hover:text-gray-950 flex items-center gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          href="https://linkedin.com/in/shivraj-soni-34572b226" target="_blank"> <BsLinkedin /> </a>

        <a className="bg-white p-4 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          href="https://github.com/Shivrajsoni" target="Shivrajsoni"> <FaGithubSquare /> </a>
      </motion.div>

    </section>
  )
}

export default Intro
