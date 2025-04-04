"use client"

import * as React from "react";
import {
  Navbar, 
  NavbarProps, 
  NavbarContent, 
  NavbarItem, 
  Link,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@heroui/react";
import { NewProjectIcon } from '@/public/icons/NewProjectIcon';
import { LoadProjectIcon } from '@/public/icons/LoadProjectIcon';
import { SaveProjectIcon } from '@/public/icons/SaveProjectIcon';

import { useProjectState } from "@/utils/ProjectState";

const TimelineNav = (
  {
    editingProject,
    setEditingProject,
    ...props
  }: {
    editingProject: boolean,
    setEditingProject: React.Dispatch<React.SetStateAction<boolean>>,
  } & NavbarProps
) => {
  // UI
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  // States
  // Global state
  const { 
    projectState, setProjectState,
    setProjectName, addEntity, editEntity, deleteEntity 
  } = useProjectState();

  // Nav Projects UI state 
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<any>(null);
  const delay = 1000;

  // New Project Medal UI states
  const [isNewProjectMedalOpen, setIsNewProjectMedalOpen] = React.useState(false);


  // Functions

  const createNewProject = () => {
    // Prepare Data

    setEditingProject(true);
    // Get the name from input
    // TODO: Update here
    // setProjectName("Something");

    // Close the modale
    setIsNewProjectMedalOpen(false)
  }

  return (
    <Navbar {...props}>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem>
          <Dropdown
            isOpen={isProjectDropdownOpen}>
            <DropdownTrigger>
              <Button 
                className="min-w-44 max-w-44"
                variant="bordered"
                onMouseEnter={() => {
                  clearTimeout(timeoutId);
                  setIsProjectDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  const id = setTimeout(() => setIsProjectDropdownOpen(false), delay);
                  setTimeoutId(id);
                }}
              >
                {editingProject
                  ? projectState.projectName
                  : "No current project"
                }
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              variant="faded"
              onMouseEnter={() => {
                clearTimeout(timeoutId);
                setIsProjectDropdownOpen(true);
              }}
              onMouseLeave={() => {
                setIsProjectDropdownOpen(false);
              }}
            >
              <DropdownItem
                key="new"
                startContent={<NewProjectIcon className={iconClasses} />}
                onPress={()=>{setIsNewProjectMedalOpen(true)}}
              >
                New Project
              </DropdownItem>
              <DropdownItem
                key="open"
                startContent={<LoadProjectIcon className={iconClasses} />}
              >
                Open Project
              </DropdownItem>
              <DropdownItem
                key="save"
                startContent={<SaveProjectIcon className={iconClasses} />}
                className={editingProject
                  ? ""
                  : "hidden"
                }
              >
                Save Project
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Entities
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Events
          </Link>
        </NavbarItem>
      </NavbarContent>
      {/* New Project Modal */}
      <Modal isOpen={isNewProjectMedalOpen}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">New Project</ModalHeader>
          <ModalBody>
            <Input 
              label="Project Name" 
              defaultValue="New Project"
              type="text" 
              variant="underlined" 
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={()=>{setIsNewProjectMedalOpen(false)}}>
              Close
            </Button>
            <Button color="primary" onPress={createNewProject}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Navbar>
  );
}

export default TimelineNav;