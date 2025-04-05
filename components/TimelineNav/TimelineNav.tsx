"use client"

import * as React from "react";
import {useTranslations} from 'next-intl';
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
} from "@heroui/react";
import { NewProjectIcon } from '@/public/icons/NewProjectIcon';
import { LoadProjectIcon } from '@/public/icons/LoadProjectIcon';
import { SaveProjectIcon } from '@/public/icons/SaveProjectIcon';
import { useProjectState } from "@/utils/ProjectState";
import NewProjectModal from "../Modals/NewProjectModal";

const TimelineNav = ( props: NavbarProps ) => {
  // UI
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  // States
  // Global state
  const { projectState } = useProjectState();

  // Nav Projects state 
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<any>(null);
  const delay = 1000;

  // New Project Modal
  const { 
    isOpen: isNewProjectModalOpen, 
    onOpen: onNewProjectModalOpen, 
    onClose: onNewProjectModalClose 
  } = useDisclosure()

  const t = useTranslations("TimelineNav");

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
                {projectState.editingMode
                  ? projectState.projectName
                  : t("noProject")
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
                onPress={onNewProjectModalOpen}
              >
                {t("newProject")}
              </DropdownItem>
              <DropdownItem
                key="open"
                startContent={<LoadProjectIcon className={iconClasses} />}
              >
                {t("openProject")}
              </DropdownItem>
              <DropdownItem
                key="save"
                startContent={<SaveProjectIcon className={iconClasses} />}
                className={projectState.editingMode
                  ? ""
                  : "hidden"
                }
              >
                {t("saveProject")}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        <NavbarItem>
          <Link 
            color="foreground"
            href="/entities"
            isDisabled={!projectState.editingMode}
          >
            {t("entityPageLink")}
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            color="foreground"
            href="/events"
            isDisabled={!projectState.editingMode}
          >
            {t("eventPageLink")}
          </Link>
        </NavbarItem>
      </NavbarContent>
      {/* New Project Modal */}
      <NewProjectModal isOpen={isNewProjectModalOpen} onOpenChange={onNewProjectModalClose}>
        <></>
      </NewProjectModal>
    </Navbar>
  );
}

export default TimelineNav;