"use client"

import * as React from "react";
import {useLocale, useTranslations} from "next-intl";
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
  Selection
} from "@heroui/react";
import { NewProjectIcon } from "@/public/icons/NewProjectIcon";
import { LoadProjectIcon } from "@/public/icons/LoadProjectIcon";
import { SaveProjectIcon } from "@/public/icons/SaveProjectIcon";
import { LanguageIcon } from "@/public/icons/LanguageIcon";
import { useProjectState } from "@/utils/ProjectState";
import NewProjectModal from "../Modals/NewProjectModal";
import { locales, localNames } from "@/i18n/config";
import { setUserLocale } from "@/utils/locale";
import { RenameProjectIcon } from "@/public/icons/RenameProjectIcon";
import RenameProjectModal from "../Modals/RenameProjectModal";
import { useRouter } from "next/navigation";
import OpenProjectModal from "../Modals/OpenProjectModal";
import NewEntityModal from "../Modals/NewEntityModal";
import NewEventModal from "../Modals/NewEventModal";

const TimelineNav = ( props: NavbarProps ) => {
  const router = useRouter();
  // Locals
  const t = useTranslations("TimelineNav");
  const currentLocale = useLocale();

  // UI
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  // States
  // Global state
  const { projectState } = useProjectState();
  const delay = 1000;
  // Nav Projects state 
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = React.useState(false);
  const [projectDropdownTimeoutId, setProjectDropdownTimeoutId] = React.useState<any>(null);
  // Entities state
  const [isEntityDropdownOpen, setIsEntityDropdownOpen] = React.useState(false);
  const [entityDropdownTimeoutId, setEntityDropdownTimeoutId] = React.useState<any>(null);
  // Entities state
  const [isEventDropdownOpen, setIsEventDropdownOpen] = React.useState(false);
  const [eventDropdownTimeoutId, setEventDropdownTimeoutId] = React.useState<any>(null);

  // Locale states
  const [isLocalDropdownOpen, setIsLocalDropdownOpen] = React.useState(false);
  const [localDropdownTimeoutId, setLocalDropdownTimeoutId] = React.useState<any>(null);
  const [selectedLocal, setSelectedLocal] = React.useState<Selection>(new Set([currentLocale]));

  // New Project Modal
  const { 
    isOpen: isNewProjectModalOpen, 
    onOpen: onNewProjectModalOpen, 
    onClose: onNewProjectModalClose 
  } = useDisclosure();
  //Load project modal
  const { 
    isOpen: isOpenProjectModalOpen, 
    onOpen: onOpenProjectModalOpen, 
    onClose: onOpenProjectModalClose 
  } = useDisclosure();
  // Rename project modal
  const { 
    isOpen: isRenameProjectModalOpen, 
    onOpen: onRenameProjectModalOpen, 
    onClose: onRenameProjectModalClose 
  } = useDisclosure();
  // New Entity Modal
  const { 
    isOpen: isNewEntityModalOpen, 
    onOpen: onNewEntityModalOpen, 
    onClose: onNewEntityModalClose 
  } = useDisclosure();
  // New Event Modal
  const { 
    isOpen: isNewEventModalOpen, 
    onOpen: onNewEventModalOpen, 
    onClose: onNewEventModalClose 
  } = useDisclosure();

  const switchLanguage = (selectedLocalSet: any) => {
    setSelectedLocal(selectedLocalSet);
    const selectedLocal = [...selectedLocalSet][0];
    setUserLocale(selectedLocal);
  };

  // Save project
  const saveProjectAsJson = () => {
    const jsonStr = JSON.stringify(projectState, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = projectState.projectName;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Navbar maxWidth="2xl" {...props}>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarItem>
          <Dropdown
            isOpen={isProjectDropdownOpen}>
            <DropdownTrigger>
              <Button 
                className="min-w-44 max-w-44"
                variant="bordered"
                onMouseEnter={() => {
                  clearTimeout(projectDropdownTimeoutId);
                  setIsProjectDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  const id = setTimeout(() => setIsProjectDropdownOpen(false), delay);
                  setProjectDropdownTimeoutId(id);
                }}
                // Use onClick here as onPress will be overwrite by DropdownTrigger
                onClick={()=>{router.push("/")}}
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
                clearTimeout(projectDropdownTimeoutId);
                setIsProjectDropdownOpen(true);
              }}
              onMouseLeave={() => {
                setIsProjectDropdownOpen(false);
              }}
            >
              <DropdownItem
                key="projectNew"
                startContent={<NewProjectIcon className={iconClasses} />}
                onPress={onNewProjectModalOpen}
              >
                {t("newProject")}
              </DropdownItem>
              <DropdownItem
                key="projectOpen"
                startContent={<LoadProjectIcon className={iconClasses} />}
                onPress={onOpenProjectModalOpen}
              >
                {t("openProject")}
              </DropdownItem>
              <DropdownItem
                key="projectRename"
                startContent={<RenameProjectIcon className={iconClasses} />}
                onPress={onRenameProjectModalOpen}
                className={projectState.editingMode
                  ? ""
                  : "hidden"
                }
              >
                {t("renameProject")}
              </DropdownItem>
              <DropdownItem
                key="projectSave"
                startContent={<SaveProjectIcon className={iconClasses} />}
                onPress={saveProjectAsJson}
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
          <Dropdown
            isOpen={isEntityDropdownOpen}>
            <DropdownTrigger>
              <Link 
                color="foreground"
                href="/entities"
                isDisabled={!projectState.editingMode}
                onMouseEnter={() => {
                  clearTimeout(entityDropdownTimeoutId);
                  setIsEntityDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  const id = setTimeout(() => setIsEntityDropdownOpen(false), delay);
                  setEntityDropdownTimeoutId(id);
                }}
              >
                {t("entityPageLink")}
              </Link>
            </DropdownTrigger>
            <DropdownMenu 
              variant="faded"
              onMouseEnter={() => {
                clearTimeout(entityDropdownTimeoutId);
                setIsEntityDropdownOpen(true);
              }}
              onMouseLeave={() => {
                setIsEntityDropdownOpen(false);
              }}
            >
              <DropdownItem
                key="entityOverview"
                onPress={()=>{router.push("/entities")}}
              >
                {t("entityOverview")}
              </DropdownItem>
              <DropdownItem
                key="entityCreate"
                onPress={onNewEntityModalOpen}
              >
                {t("createNewEntity")}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        <NavbarItem>
          <Link 
            color="foreground"
            href="/chapters"
            isDisabled={!projectState.editingMode}
          >                                 
            {t("chapterPageLink")}
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Dropdown
            isOpen={isEventDropdownOpen}>
            <DropdownTrigger>
              <Link 
                color="foreground"
                href="/events"
                isDisabled={!projectState.editingMode}
                onMouseEnter={() => {
                  clearTimeout(eventDropdownTimeoutId);
                  setIsEventDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  const id = setTimeout(() => setIsEventDropdownOpen(false), delay);
                  setEventDropdownTimeoutId(id);
                }}
              >
                {t("eventPageLink")}
              </Link>
            </DropdownTrigger>
            <DropdownMenu 
              variant="faded"
              onMouseEnter={() => {
                clearTimeout(eventDropdownTimeoutId);
                setIsEventDropdownOpen(true);
              }}
              onMouseLeave={() => {
                setIsEventDropdownOpen(false);
              }}
            >
              <DropdownItem
                key="eventOverview"
                onPress={()=>{router.push("/events")}}
              >
                {t("eventOverview")}
              </DropdownItem>
              <DropdownItem
                key="entityCreate"
                onPress={onNewEventModalOpen}
              >
                {t("createNewEvent")}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
      {/* Locale switch */}
      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown
            isOpen={isLocalDropdownOpen}>
            <DropdownTrigger>
              <LanguageIcon
                color="ffffff"
                width={36}
                height={36}
                onMouseEnter={() => {
                  clearTimeout(localDropdownTimeoutId);
                  setIsLocalDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  const id = setTimeout(() => setIsLocalDropdownOpen(false), delay);
                  setLocalDropdownTimeoutId(id);
                }}
              />
            </DropdownTrigger>
            <DropdownMenu 
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedLocal}
              onSelectionChange={switchLanguage}
              onMouseEnter={() => {
                clearTimeout(localDropdownTimeoutId);
                setIsLocalDropdownOpen(true);
              }}
              onMouseLeave={() => {
                setIsLocalDropdownOpen(false);
              }}
            >
              {locales.map((local)=>(
                <DropdownItem 
                  key={local}
                >{localNames[local]}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
      {/* Modals */}
      <NewProjectModal isOpen={isNewProjectModalOpen} onOpenChange={onNewProjectModalClose}>
        <></>
      </NewProjectModal>
      <OpenProjectModal isOpen={isOpenProjectModalOpen} onOpenChange={onOpenProjectModalClose}>
        <></>
      </OpenProjectModal>
      <RenameProjectModal isOpen={isRenameProjectModalOpen} onOpenChange={onRenameProjectModalClose}>
        <></>
      </RenameProjectModal>
      <NewEntityModal isOpen={isNewEntityModalOpen} onOpenChange={onNewEntityModalClose}>
        <></>
      </NewEntityModal>
      <NewEventModal isOpen={isNewEventModalOpen} onOpenChange={onNewEventModalClose}>
        <></>
      </NewEventModal>
    </Navbar>
  );
}

export default TimelineNav;