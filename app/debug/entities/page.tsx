'use client';

import React from 'react';
import { useProjectState } from "@/utils/ProjectState";

const EntitiesPage = () => {
  const { projectState } = useProjectState();
  const entities = Object.values(projectState.entities || {});

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Entities Debug View</h1>
      {entities.length === 0 ? (
        <p className="text-gray-500">No entities found.</p>
      ) : (
        entities.map((entity) => (
          <div key={entity.id} className="bg-white shadow rounded-lg">
            <div className="border-b px-4 py-2 bg-gray-50">
              <h2 className="font-semibold text-lg text-gray-800">
                {entity.name} ({entity.type})
              </h2>
            </div>
            <div className="px-4 py-3 text-gray-700 space-y-1">
              <p><span className="font-medium">ID:</span> {entity.id}</p>
              <p><span className="font-medium">Color:</span> {entity.color}</p>
              <div>
                <p className="font-medium">Status:</p>
                <pre className="text-sm bg-gray-100 rounded p-2 overflow-x-auto">
                  {JSON.stringify(entity.status, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EntitiesPage;