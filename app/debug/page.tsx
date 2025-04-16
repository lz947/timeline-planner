"use client"

import { useProjectState } from "@/utils/ProjectState";

const DebugPage = () => {
  const { projectState } = useProjectState();

  const entityCount = Object.keys(projectState.entities || {}).length;
  const eventCount = Object.keys(projectState.events || {}).length;
  const chapterCount = Object.keys(projectState.chapters || {}).length;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg max-w-md w-full">
        <div className="border-b px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {projectState.projectName}
          </h2>
        </div>
        <div className="px-6 py-4 text-gray-700 space-y-2">
          <p>
            <span className="font-medium">Entities:</span> {entityCount}
          </p>
          <p>
            <span className="font-medium">Events:</span> {eventCount}
          </p>
          <p>
            <span className="font-medium">Chapters:</span> {chapterCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;