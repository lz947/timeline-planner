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
  setProjectEvents: (newProjectEvent: Record<number, Event>) => void;
  addEvent: (newEvent: Event) => void;
  editEvent: (id: number, newEvent: Event) => void;
  deleteEvent: (id: number) => void;
  setProjectChapter: (newProjectChapter: Record<number, Chapter>) => void;
  addChapter: (newChapter: Chapter) => void;
  editChapter: (id: number, newChapter: Chapter) => void;
  deleteChapter: (id: number) => void;
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

  // Events
  const setProjectEvents = (newProjectEvents: Record<number, Event>) => {
    setProjectState((prevState) => ({
      ...prevState,
      events: newProjectEvents,
    }));
  };

  const addEvent = (newEvent: Event) => {
    setProjectState((prevState) => ({
      ...prevState,
      eventTrackingId: prevState.entityTrackingId + 1,
      events: {
        ...prevState.events,
        [prevState.entityTrackingId]: newEvent,
      },
    }));
  };

  const editEvent = (id: number, newEvent: Event) => {
    setProjectState((prevState) => ({
      ...prevState,
      events: {
        ...prevState.events,
        [id]: newEvent,
      },
    }));
  };

  const deleteEvent = (id: number) => {
    setProjectState((prevState) => {
      const newEvents = { ...prevState.events };
      delete newEvents[id];

      return { ...prevState, events: newEvents };
    });
  };

  // Chapter
  const setProjectChapter = (newProjectChapters: Record<number, Chapter>) => {
    setProjectState((prevState) => ({
      ...prevState,
      chapters: newProjectChapters,
    }));
  };

  const addChapter = (newChapter: Chapter) => {
    setProjectState((prevState) => ({
      ...prevState,
      chapterTrackingId: prevState.entityTrackingId + 1,
      chapters: {
        ...prevState.chapters,
        [prevState.entityTrackingId]: newChapter,
      },
    }));
  };

  const editChapter = (id: number, newChapter: Chapter) => {
    setProjectState((prevState) => ({
      ...prevState,
      chapters: {
        ...prevState.chapters,
        [id]: newChapter,
      },
    }));
  };

  const deleteChapter = (id: number) => {
    setProjectState((prevState) => {
      const newChapters = { ...prevState.chapters };
      delete newChapters[id];

      return { ...prevState, chapters: newChapters };
    });
  };

  return (
    <StateContext.Provider 
      value={{ 
        projectState, setProjectState,
        setProjectName, setEditingMode,
        setProjectEntites, addEntity, editEntity, deleteEntity,
        setEntityTypes, addEntityType, deleteEntityType,
        setProjectEvents, addEvent, editEvent, deleteEvent,
        setProjectChapter, addChapter, editChapter, deleteChapter,
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
