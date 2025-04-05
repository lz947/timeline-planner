import { createContext, useContext, useState, ReactNode } from "react";

//entities
// {id: {id:xxx, name:xxx...}}
interface Entity {
  id: number;
  name: string;
  entityType: EntityType;
  entityTypeValues: [];
}

//entity type: a custom set of keys that needed in the entity
interface EntityType {
  id: number;
  keys: [];
}

interface ProjectState {
  projectName: string;
  entityTrackingId: number;
  entities: Record<number, Entity>;
  entityTypeTrackingId: number;
  entityTypes: Record<number, Entity>;
}

interface ProjectStateContextType {
  projectState: ProjectState;
  setProjectState: (newProjectState: ProjectState) => void;
  setProjectName: (newProjectName: string) => void;
  setProjectEntity: (newProjectEntity: Record<number, Entity>) => void;
  addEntity: (newEntity: Entity) => void;
  editEntity: (id: number, newEntity: Entity) => void;
  deleteEntity: (id: number) => void;
}

// Define the context
const StateContext = createContext<ProjectStateContextType | undefined>(undefined);

// Provider component
export const StateProvider = ({ children } : { children:any }) => {
  const [projectState, setProjectState] = useState<ProjectState>({
    projectName: "New Project",
    entityTrackingId: 0,
    entities: {},
    entityTypeTrackingId: 0,
    entityTypes: {},
  });

  const setProjectName = (newProjectName: string) => {
    setProjectState((prevState) => ({
      ...prevState,
      projectName: newProjectName,
    }));
  };

  const setProjectEntity = (newProjectEntity: Record<number, Entity>) => {
    setProjectState((prevState) => ({
      ...prevState,
      entities: newProjectEntity,
    }));
  };

  const addEntity = (newEntity: Entity) => {
    setProjectState((prevState) => ({
      ...prevState,
      entityTrackingId: prevState.entityTrackingId + 1,
      entities: {
        ...prevState.entities,
        [prevState.entityTrackingId]: newEntity,
      },
    }));
  };

  const editEntity = (id: number, newEntity: Entity) => {
    setProjectState((prevState) => ({
      ...prevState,
      entities: {
        ...prevState.entities,
        [id]: newEntity,
      },
    }));
  };

  const deleteEntity = (id: number) => {
    setProjectState((prevState) => {
      const newEntities = { ...prevState.entities };
      delete newEntities[id];

      return { ...prevState, entities: newEntities };
    });
  };

  return (
    <StateContext.Provider 
      value={{ 
        projectState, setProjectState,
        setProjectName, setProjectEntity,
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