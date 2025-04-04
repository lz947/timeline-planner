import { createContext, useContext, useState, ReactNode } from "react";

//entities
// {id: {id:xxx, name:xxx...}}
interface Entity {
  id: string;
  name: string;
}

interface projectState {
  projectName: string;
  entities: Record<string, Entity>;
}

interface ProjectStateContextType {
  projectState: projectState;
  setProjectState: (newProjectState:projectState) => void;
  setProjectName: (newprojectName: string) => void;
  addEntity: (id: string, newEntity: Entity) => void;
  editEntity: (id: string, newEntity: Entity) => void;
  deleteEntity: (id: string) => void;
}

// Define the context
const StateContext = createContext<ProjectStateContextType | undefined>(undefined);

// Provider component
export const StateProvider = ({ children } : { children:any }) => {
  const [projectState, setProjectState] = useState<projectState>({
    projectName: "New Project",
    entities: {},
  });

  const setProjectName = (newprojectName: string) => {
    setProjectState((prevState) => ({
      ...prevState,
      projectName: newprojectName,
    }));
  };

  // Add a new user
  const addEntity = (id: string, newEntity: Entity) => {
    setProjectState((prevState) => ({
      ...prevState,
      entities: {
        ...prevState.entities,
        [id]: newEntity,
      },
    }));
  };

  // Edit a user
  const editEntity = (id: string, newEntity: Entity) => {
    setProjectState((prevState) => ({
      ...prevState,
      entities: {
        ...prevState.entities,
        [id]: newEntity,
      },
    }));
  };

  // Delete a user
  const deleteEntity = (id: string) => {
    setProjectState((prevState) => {
      const newEntities = { ...prevState.entities };
      delete newEntities[id];

      return { ...prevState, entities: newEntities };
    });
  };

  return (
    <StateContext.Provider 
      value={{ 
        projectState, setProjectState, setProjectName, 
        addEntity, editEntity, deleteEntity  
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Custom hook to use the state
export const useProjectState = (): ProjectStateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useProjectState must be used within a StateProvider");
  }
  return context;
};