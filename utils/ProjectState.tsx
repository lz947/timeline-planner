import { createContext, useContext, useState, ReactNode } from "react";

//entities
// {id: {id:xxx, name:xxx...}}
export interface Entity {
  id: number;
  type: string;
  name: string;
  color: string;
  status: Record<string, Record<number, string[]>>;
}

export interface Event {
  id: number;
  name: string;
  summary: string;
  startTime: string;
  endTime: string;
  involvedEntities: Record<number,string>;
}

export interface Chapter {
  id: number;
  name: string;
  summary: string;
  events: Array<number>;
}

export interface ProjectState {
  projectName: string;
  editingMode: boolean;
  entityTrackingId: number;
  entities: Record<number, Entity>;
  entityTypes: Array<string>;
  eventTrackingId: number;
  events: Record<number, Event>;
  chapterTrackingId: number;
  chapters: Record<number, Chapter>;
}

// Create new project
export const createNewProjectState = (newProjectName: string) => {
  return {
    projectName: newProjectName,
    editingMode: true,
    entityTrackingId: 0,
    entities: {},
    entityTypes: [],
    eventTrackingId: 0,
    events: {},
    chapterTrackingId: 0,
    chapters: {}
  } as ProjectState;
}

// Verify if a object is project
const instanceOfEntity = (object: any) => {
  const entityCheck =
    ("id" in object) && ("type" in object) && 
    ("name" in object) && ("status" in object) && ("color" in object);
  return entityCheck;
};

const instanceOfEvent = (object: any) => {
  const entityCheck =
    ("id" in object) && ("name" in object) && ("summary" in object) && 
    ("startTime" in object) && ("endTime" in object) && ("involvedEntities" in object);
  return entityCheck;
};

const instanceOfChapter= (object: any) => {
  const entityCheck =
    ("id" in object) && ("name" in object) && 
    ("summary" in object) && ("events" in object);
  return entityCheck;
};

export const instanceOfProjectState = (object: any) => {
  const basicCheck = 
    ("projectName" in object) && ("editingMode" in object) && 
    ("entityTrackingId" in object) && ("entities" in object) && ("entityTypes" in object) &&
    ("eventTrackingId" in object) && ("events" in object) && 
    ("chapterTrackingId" in object) && ("chapters" in object);

  for (var entity in object.entities) {
    if (!instanceOfEntity(object.entities[entity])) {
      return false;
    }
  }

  for (var event in object.events) {
    if (!instanceOfEvent(object.events[event])) {
      return false;
    }
  }

  for (var chapter in object.chapters) {
    if (!instanceOfChapter(object.chapters[chapter])) {
      return false;
    }
  }

  return basicCheck;
};

interface ProjectStateContextType {
  projectState: ProjectState;
  setProjectState: (newProjectState: ProjectState) => void;
  setEditingMode: (newEditingMode: boolean) => void;
  setProjectName: (newProjectName: string) => void;
  setProjectEntites: (newProjectEntity: Record<number, Entity>) => void;
  addEntity: (newEntity: Entity) => void;
  editEntity: (id: number, newEntity: Entity) => void;
  deleteEntity: (id: number) => void;
  setEntityTypes: (newEntityTypes: Array<string>) => void;
  addEntityType: (newEntityType: string) => void;
  deleteEntityType: (id: number) => void;
}

// Define the context
const StateContext = createContext<ProjectStateContextType | undefined>(undefined);

// Provider component
export const StateProvider = ({ children } : { children:any }) => {
  const [projectState, setProjectState] = useState<ProjectState>({
    projectName: "New Project",
    editingMode: false,
    entityTrackingId: 0,
    entities: {},
    entityTypes: [],
    eventTrackingId: 0,
    events: {},
    chapterTrackingId: 0,
    chapters: {}
  });

  const setProjectName = (newProjectName: string) => {
    setProjectState((prevState) => ({
      ...prevState,
      projectName: newProjectName,
    }));
  };

  const setEditingMode = (newEditingMode: boolean) => {
    setProjectState((prevState) => ({
      ...prevState,
      editingMode: newEditingMode,
    }));
  };

  // Entities
  const setProjectEntites = (newProjectEntities: Record<number, Entity>) => {
    setProjectState((prevState) => ({
      ...prevState,
      entities: newProjectEntities,
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

  // Entity type
  const setEntityTypes = (newEntityTypes: Array<string>) => {
    setProjectState((prevState) => ({
      ...prevState,
      entityTypes: newEntityTypes,
    }));
  };

  const addEntityType = (newEntityType: string) => {
    setProjectState((prevState) => ({
      ...prevState,
      entityTypes: [...prevState.entityTypes, newEntityType],
    }));
  };

  const deleteEntityType = (targetEntityTypeIndex: number) => {
    setProjectState((prevState) => ({
      ...prevState,
      entityTypes: prevState.entityTypes.filter((_, i) => i !== targetEntityTypeIndex),
    }));0
  };

  return (
    <StateContext.Provider 
      value={{ 
        projectState, setProjectState,
        setProjectName, setEditingMode,
        setProjectEntites, addEntity, editEntity, deleteEntity,
        setEntityTypes, addEntityType, deleteEntityType
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
