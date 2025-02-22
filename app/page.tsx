import Intro from "../components/intro.tsx";
import  SectionDivider  from "../components/section-divider.tsx";
export default function Home() {
  return (
  <main className = "flex flex-col items-center px-4">
      <Intro/>
      <SectionDivider/>
    </main>
  );
}
