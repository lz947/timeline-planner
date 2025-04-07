"use client"

import { useProjectState } from "@/utils/ProjectState";

const Entities = () => {
  const { projectState } = useProjectState();

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div>
        Entities
      </div>
      <div>
        {JSON.stringify(projectState, null, 2)}
      </div>
    </section>
  );
}

export default Entities;
  