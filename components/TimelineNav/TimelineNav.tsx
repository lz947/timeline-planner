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
  DropdownItem
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

  const [isOpen, setIsOpen] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<any>(null);
  const delay = 1000;

  return (
    <Navbar {...props}>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem>
        <Dropdown
          isOpen={isOpen}>
          <DropdownTrigger>
            <Button 
              variant="bordered"
              onMouseEnter={() => {
                clearTimeout(timeoutId);
                setIsOpen(true);
              }}
              onMouseLeave={() => {
                const id = setTimeout(() => setIsOpen(false), delay);
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
              setIsOpen(true);
            }}
            onMouseLeave={() => {
              setIsOpen(false);
            }}
          >
            <DropdownItem
              key="new"
              startContent={<NewProjectIcon className={iconClasses} />}
            >
              New file
            </DropdownItem>
            <DropdownItem
              key="copy"
              startContent={<LoadProjectIcon className={iconClasses} />}
            >
              Copy link
            </DropdownItem>
            <DropdownItem
              key="edit"
              startContent={<SaveProjectIcon className={iconClasses} />}
            >
              Edit file
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