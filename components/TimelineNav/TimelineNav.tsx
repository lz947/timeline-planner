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
} from "@heroui/react";
import { NewProjectIcon } from '@/public/icons/NewProjectIcon';
import { LoadProjectIcon } from '@/public/icons/LoadProjectIcon';
import { SaveProjectIcon } from '@/public/icons/SaveProjectIcon';

const TimelineNav = (
  {
    editingProject,
    setEditingProject,
    projectName,
    setProjectName,
    ...props
  }: {
    editingProject: boolean,
    setEditingProject: React.Dispatch<React.SetStateAction<boolean>>,
    projectName: string,
    setProjectName: React.Dispatch<React.SetStateAction<string>>
  } & NavbarProps
) => {
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  // Project states

  const createNewProject = () => {
    setEditingProject(true);
    setProjectName("Something");
  }


  // UI states
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<any>(null);
  const delay = 1000;

  return (
    <Navbar {...props}>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem>
          <Dropdown
            isOpen={isProjectDropdownOpen}>
            <DropdownTrigger>
              <Button 
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
                  ? projectName
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
                // onPress={}
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
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default TimelineNav;